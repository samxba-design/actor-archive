use crate::capture::ScreenCapture;
use crate::input::RemoteInput;
use deskbridge_protocol::{ClientMessage, ServerMessage};
use futures_util::{SinkExt, StreamExt};
use std::sync::Arc;
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::{mpsc, Mutex};
use tokio_tungstenite::{accept_async, tungstenite::Message};
use tracing::{error, info, warn};

pub async fn run_server(addr: std::net::SocketAddr, pin: String) -> Result<(), Box<dyn std::error::Error>> {
    let listener = TcpListener::bind(addr).await?;
    info!(%addr, "listening for Mac clients");

    loop {
        let (stream, peer) = listener.accept().await?;
        let pin = pin.clone();
        tokio::spawn(async move {
            if let Err(error) = handle_connection(stream, pin).await {
                warn!(%peer, %error, "client session ended");
            }
        });
    }
}

async fn handle_connection(
    stream: TcpStream,
    expected_pin: String,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let ws = accept_async(stream).await?;
    let (write, mut read) = ws.split();
    let write = Arc::new(Mutex::new(write));

    let hostname = hostname::get()
        .ok()
        .and_then(|name| name.into_string().ok())
        .unwrap_or_else(|| "Windows PC".to_string());

    let capture = ScreenCapture::primary()?;
    let (screen_width, screen_height) = capture.dimensions();
    let capture = Arc::new(Mutex::new(capture));
    let input = Arc::new(Mutex::new(RemoteInput::new()));

    let mut authenticated = false;
    let (frame_tx, mut frame_rx) = mpsc::channel::<ServerMessage>(4);
    let mut stream_task = None;

    loop {
        tokio::select! {
            client_message = read.next() => {
                let Some(message) = client_message else {
                    break;
                };
                let message = message?;
                if !message.is_text() {
                    continue;
                }

                let client_msg: ClientMessage = match serde_json::from_str(message.to_text()?) {
                    Ok(msg) => msg,
                    Err(error) => {
                        send_json(&write, ServerMessage::Error {
                            message: format!("Invalid message: {error}"),
                        }).await?;
                        continue;
                    }
                };

                match client_msg {
                    ClientMessage::Auth { pin } => {
                        let success = pin == expected_pin;
                        send_json(&write, ServerMessage::AuthResult {
                            success,
                            message: if success { None } else { Some("Incorrect PIN".to_string()) },
                            screen_width,
                            screen_height,
                            hostname: hostname.clone(),
                        }).await?;

                        if success {
                            authenticated = true;
                            info!("Mac client authenticated");

                            let capture_clone = Arc::clone(&capture);
                            let frame_tx_clone = frame_tx.clone();
                            stream_task = Some(tokio::spawn(async move {
                                stream_frames(capture_clone, frame_tx_clone).await;
                            }));
                        } else {
                            warn!("authentication failed");
                        }
                    }
                    ClientMessage::Ping => {
                        send_json(&write, ServerMessage::Pong).await?;
                    }
                    ClientMessage::RequestScreenInfo => {
                        send_json(&write, ServerMessage::ScreenInfo {
                            width: screen_width,
                            height: screen_height,
                            hostname: hostname.clone(),
                        }).await?;
                    }
                    ClientMessage::MouseMove { x, y } => {
                        if !authenticated {
                            send_json(&write, ServerMessage::Error {
                                message: "Authenticate with PIN first".to_string(),
                            }).await?;
                            continue;
                        }
                        let mut input = input.lock().await;
                        if let Err(error) = input.move_mouse(x, y) {
                            warn!(%error, "mouse move failed");
                        }
                    }
                    ClientMessage::MouseButton { button, pressed } => {
                        if !authenticated {
                            send_json(&write, ServerMessage::Error {
                                message: "Authenticate with PIN first".to_string(),
                            }).await?;
                            continue;
                        }
                        let mut input = input.lock().await;
                        if let Err(error) = input.mouse_button(button, pressed) {
                            warn!(%error, "mouse button failed");
                        }
                    }
                    ClientMessage::MouseScroll { delta_x, delta_y } => {
                        if !authenticated {
                            send_json(&write, ServerMessage::Error {
                                message: "Authenticate with PIN first".to_string(),
                            }).await?;
                            continue;
                        }
                        let mut input = input.lock().await;
                        if let Err(error) = input.mouse_scroll(delta_x, delta_y) {
                            warn!(%error, "mouse scroll failed");
                        }
                    }
                    ClientMessage::Key { key, pressed, modifiers } => {
                        if !authenticated {
                            send_json(&write, ServerMessage::Error {
                                message: "Authenticate with PIN first".to_string(),
                            }).await?;
                            continue;
                        }
                        let mut input = input.lock().await;
                        if let Err(error) = input.key(&key, pressed, &modifiers) {
                            warn!(%error, "key event failed");
                        }
                    }
                }
            }
            frame = frame_rx.recv(), if authenticated => {
                match frame {
                    Some(message) => send_json(&write, message).await?,
                    None => break,
                }
            }
        }
    }

    if let Some(task) = stream_task {
        task.abort();
    }

    Ok(())
}

async fn send_json<S>(
    write: &Arc<Mutex<S>>,
    message: ServerMessage,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>>
where
    S: SinkExt<Message> + Unpin,
    S::Error: std::error::Error + Send + Sync + 'static,
{
    let json = serde_json::to_string(&message)?;
    let mut write = write.lock().await;
    write
        .send(Message::Text(json))
        .await
        .map_err(|error| Box::new(error) as Box<dyn std::error::Error + Send + Sync>)?;
    Ok(())
}

async fn stream_frames(capture: Arc<Mutex<ScreenCapture>>, frame_tx: mpsc::Sender<ServerMessage>) {
    let target_frame_time = std::time::Duration::from_millis(33);

    loop {
        let started = std::time::Instant::now();

        let frame = {
            let mut capture = capture.lock().await;
            let (width, height) = capture.dimensions();
            match capture.capture_jpeg(70) {
                Ok(data) => Some(ServerMessage::Frame { width, height, data }),
                Err(error) => {
                    error!(%error, "frame capture failed");
                    None
                }
            }
        };

        if let Some(message) = frame {
            if frame_tx.send(message).await.is_err() {
                break;
            }
        }

        let elapsed = started.elapsed();
        if elapsed < target_frame_time {
            tokio::time::sleep(target_frame_time - elapsed).await;
        }
    }
}
