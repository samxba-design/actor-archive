const DEFAULT_PORT = 9478;

const connectPanel = document.getElementById("connect-panel");
const remotePanel = document.getElementById("remote-panel");
const connectForm = document.getElementById("connect-form");
const connectError = document.getElementById("connect-error");
const statusEl = document.getElementById("status");
const disconnectBtn = document.getElementById("disconnect-btn");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const viewport = document.getElementById("viewport");
const frame = document.getElementById("frame");
const overlay = document.getElementById("overlay");
const remoteHostname = document.getElementById("remote-hostname");
const remoteResolution = document.getElementById("remote-resolution");

let socket = null;
let remoteWidth = 0;
let remoteHeight = 0;
let captureActive = false;
let pingTimer = null;

function setStatus(text, connected) {
  statusEl.textContent = text;
  statusEl.classList.toggle("connected", connected);
  statusEl.classList.toggle("disconnected", !connected);
}

function showError(message) {
  connectError.hidden = !message;
  connectError.textContent = message || "";
}

function send(message) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}

function mapMouseButton(button) {
  if (button === 0) return "left";
  if (button === 1) return "middle";
  return "right";
}

function clientCoordsToRemote(clientX, clientY) {
  const rect = frame.getBoundingClientRect();
  const imageRatio = remoteWidth / remoteHeight;
  const elementRatio = rect.width / rect.height;

  let renderWidth;
  let renderHeight;
  let offsetX;
  let offsetY;

  if (elementRatio > imageRatio) {
    renderHeight = rect.height;
    renderWidth = renderHeight * imageRatio;
    offsetX = rect.left + (rect.width - renderWidth) / 2;
    offsetY = rect.top;
  } else {
    renderWidth = rect.width;
    renderHeight = renderWidth / imageRatio;
    offsetX = rect.left;
    offsetY = rect.top + (rect.height - renderHeight) / 2;
  }

  const x = ((clientX - offsetX) / renderWidth) * remoteWidth;
  const y = ((clientY - offsetY) / renderHeight) * remoteHeight;

  return {
    x: Math.max(0, Math.min(remoteWidth - 1, Math.round(x))),
    y: Math.max(0, Math.min(remoteHeight - 1, Math.round(y))),
  };
}

function currentModifiers(event) {
  return {
    ctrl: event.ctrlKey,
    alt: event.altKey,
    shift: event.shiftKey,
    meta: event.metaKey,
  };
}

function enableCapture() {
  captureActive = true;
  viewport.classList.add("captured");
  overlay.hidden = true;
  viewport.focus();
}

function disableCapture() {
  captureActive = false;
  viewport.classList.remove("captured");
}

function disconnect() {
  if (pingTimer) {
    clearInterval(pingTimer);
    pingTimer = null;
  }
  disableCapture();
  socket?.close();
  socket = null;
  remotePanel.hidden = true;
  connectPanel.hidden = false;
  disconnectBtn.hidden = true;
  fullscreenBtn.hidden = true;
  setStatus("Disconnected", false);
}

function handleServerMessage(message) {
  switch (message.type) {
    case "auth_result": {
      if (!message.success) {
        showError(message.message || "Authentication failed");
        disconnect();
        return;
      }

      remoteWidth = message.screen_width;
      remoteHeight = message.screen_height;
      remoteHostname.textContent = message.hostname;
      remoteResolution.textContent = `${remoteWidth} × ${remoteHeight}`;
      connectPanel.hidden = true;
      remotePanel.hidden = false;
      disconnectBtn.hidden = false;
      fullscreenBtn.hidden = false;
      overlay.hidden = false;
      overlay.textContent = "Click the screen to start controlling your PC";
      setStatus(`Connected to ${message.hostname}`, true);
      break;
    }
    case "frame": {
      frame.src = `data:image/jpeg;base64,${message.data}`;
      remoteWidth = message.width;
      remoteHeight = message.height;
      remoteResolution.textContent = `${remoteWidth} × ${remoteHeight}`;
      break;
    }
    case "error": {
      showError(message.message);
      break;
    }
    default:
      break;
  }
}

function attachInputHandlers() {
  viewport.addEventListener("mousedown", (event) => {
    if (!captureActive) {
      enableCapture();
    }
    event.preventDefault();
    const { x, y } = clientCoordsToRemote(event.clientX, event.clientY);
    send({ type: "mouse_move", x, y });
    send({
      type: "mouse_button",
      button: mapMouseButton(event.button),
      pressed: true,
    });
  });

  viewport.addEventListener("mouseup", (event) => {
    if (!captureActive) return;
    event.preventDefault();
    send({
      type: "mouse_button",
      button: mapMouseButton(event.button),
      pressed: false,
    });
  });

  viewport.addEventListener("mousemove", (event) => {
    if (!captureActive) return;
    const { x, y } = clientCoordsToRemote(event.clientX, event.clientY);
    send({ type: "mouse_move", x, y });
  });

  viewport.addEventListener(
    "wheel",
    (event) => {
      if (!captureActive) return;
      event.preventDefault();
      send({
        type: "mouse_scroll",
        delta_x: Math.sign(event.deltaX) * Math.max(1, Math.round(Math.abs(event.deltaX) / 40)),
        delta_y: Math.sign(event.deltaY) * Math.max(1, Math.round(Math.abs(event.deltaY) / 40)),
      });
    },
    { passive: false }
  );

  viewport.addEventListener("keydown", (event) => {
    if (!captureActive) return;
    if (event.key === "Escape") {
      disableCapture();
      return;
    }
    event.preventDefault();
    send({
      type: "key",
      key: event.key,
      pressed: true,
      modifiers: currentModifiers(event),
    });
  });

  viewport.addEventListener("keyup", (event) => {
    if (!captureActive) return;
    event.preventDefault();
    send({
      type: "key",
      key: event.key,
      pressed: false,
      modifiers: currentModifiers(event),
    });
  });

  viewport.addEventListener("contextmenu", (event) => event.preventDefault());
}

connectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showError("");

  const host = document.getElementById("host").value.trim();
  const port = Number(document.getElementById("port").value || DEFAULT_PORT);
  const pin = document.getElementById("pin").value.trim();

  if (!/^\d{6}$/.test(pin)) {
    showError("PIN must be exactly 6 digits");
    return;
  }

  setStatus("Connecting…", false);
  socket = new WebSocket(`ws://${host}:${port}`);

  socket.addEventListener("open", () => {
    send({ type: "auth", pin });
    pingTimer = setInterval(() => send({ type: "ping" }), 15000);
  });

  socket.addEventListener("message", (event) => {
    try {
      handleServerMessage(JSON.parse(event.data));
    } catch (error) {
      showError("Received invalid data from Windows PC");
      console.error(error);
    }
  });

  socket.addEventListener("close", () => {
    if (!connectPanel.hidden) return;
    setStatus("Disconnected", false);
    overlay.hidden = false;
    overlay.textContent = "Connection lost";
    disableCapture();
  });

  socket.addEventListener("error", () => {
    showError(`Could not reach ${host}:${port}. Is DeskBridge Server running on Windows?`);
    disconnect();
  });
});

disconnectBtn.addEventListener("click", disconnect);

fullscreenBtn.addEventListener("click", async () => {
  if (!document.fullscreenElement) {
    await viewport.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
});

attachInputHandlers();
