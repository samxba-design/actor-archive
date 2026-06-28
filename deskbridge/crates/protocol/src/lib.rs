use serde::{Deserialize, Serialize};

pub const DEFAULT_PORT: u16 = 9478;

/// Messages sent from the Mac client to the Windows host.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum ClientMessage {
    /// Authenticate with the PIN shown on the Windows companion app.
    Auth { pin: String },
    /// Move the remote cursor (coordinates in remote screen pixels).
    MouseMove { x: i32, y: i32 },
    /// Press or release a mouse button.
    MouseButton {
        button: MouseButton,
        pressed: bool,
    },
    /// Scroll the mouse wheel.
    MouseScroll { delta_x: i32, delta_y: i32 },
    /// Press or release a keyboard key.
    Key {
        key: String,
        pressed: bool,
        #[serde(default)]
        modifiers: KeyModifiers,
    },
    /// Request a fresh screen info snapshot.
    RequestScreenInfo,
    /// Keep-alive ping.
    Ping,
}

/// Messages sent from the Windows host to the Mac client.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum ServerMessage {
    /// Result of authentication attempt.
    AuthResult {
        success: bool,
        #[serde(skip_serializing_if = "Option::is_none")]
        message: Option<String>,
        screen_width: u32,
        screen_height: u32,
        hostname: String,
    },
    /// A JPEG-encoded screen frame.
    Frame {
        width: u32,
        height: u32,
        #[serde(with = "base64_bytes")]
        data: Vec<u8>,
    },
    ScreenInfo {
        width: u32,
        height: u32,
        hostname: String,
    },
    Pong,
    Error { message: String },
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum MouseButton {
    Left,
    Right,
    Middle,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq, Eq)]
pub struct KeyModifiers {
    #[serde(default)]
    pub ctrl: bool,
    #[serde(default)]
    pub alt: bool,
    #[serde(default)]
    pub shift: bool,
    #[serde(default)]
    pub meta: bool,
}

impl KeyModifiers {
    pub fn any(&self) -> bool {
        self.ctrl || self.alt || self.shift || self.meta
    }
}

mod base64_bytes {
    use base64::{engine::general_purpose::STANDARD, Engine};
    use serde::{Deserialize, Deserializer, Serializer};

    pub fn serialize<S>(bytes: &[u8], serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(&STANDARD.encode(bytes))
    }

    pub fn deserialize<'de, D>(deserializer: D) -> Result<Vec<u8>, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        STANDARD
            .decode(s)
            .map_err(|e| serde::de::Error::custom(e.to_string()))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn client_message_serializes_with_type_tag() {
        let message = ClientMessage::MouseMove { x: 100, y: 200 };
        let value: serde_json::Value = serde_json::to_value(&message).unwrap();
        assert_eq!(value["type"], json!("mouse_move"));
        assert_eq!(value["x"], json!(100));
    }

    #[test]
    fn server_frame_round_trips_base64() {
        let message = ServerMessage::Frame {
            width: 1920,
            height: 1080,
            data: vec![1, 2, 3, 4],
        };
        let json = serde_json::to_string(&message).unwrap();
        let decoded: ServerMessage = serde_json::from_str(&json).unwrap();
        match decoded {
            ServerMessage::Frame { data, width, height } => {
                assert_eq!(width, 1920);
                assert_eq!(height, 1080);
                assert_eq!(data, vec![1, 2, 3, 4]);
            }
            _ => panic!("expected frame"),
        }
    }
}
