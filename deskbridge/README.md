# DeskBridge

Control your Windows PC from your Mac over your local network. DeskBridge streams your Windows desktop to your Mac and forwards keyboard and mouse input — useful when your Mac is at your widescreen monitor and keyboard, and your Windows PC is elsewhere on the same network.

## What you get

| App | Platform | Role |
|-----|----------|------|
| **DeskBridge** | macOS | View your Windows screen and control it with your Mac keyboard/mouse |
| **DeskBridge Server** | Windows | Shares the desktop and accepts remote input |

Both apps connect over WebSocket on your LAN. A 6-digit PIN is shown on the Windows app so only you can connect.

## Quick start

### 1. Windows (host PC)

**Requirements:** Windows 10/11, same network as your Mac.

```powershell
# From the deskbridge folder
.\scripts\install-windows.ps1
```

Or build manually:

```powershell
cargo build --release -p deskbridge-server
.\target\release\deskbridge-server.exe
```

The server prints your LAN IP, port (`9478` by default), and a pairing PIN. Leave it running.

**Firewall:** Allow `deskbridge-server.exe` through Windows Firewall on private networks (the install script can add a rule).

### 2. Mac (controller)

**Requirements:** macOS 12+, [Xcode Command Line Tools](https://developer.apple.com/xcode/resources/), [Rust](https://rustup.rs/).

```bash
cd deskbridge/mac-client
./scripts/build-mac.sh
```

Open the generated `DeskBridge.app` from `mac-client/src-tauri/target/release/bundle/macos/`, or install the `.dmg`.

### 3. Connect

1. Start **DeskBridge Server** on Windows.
2. Open **DeskBridge** on your Mac.
3. Enter the Windows PC’s IP address, port, and PIN.
4. Click the streamed screen to capture mouse/keyboard.
5. Press **Esc** to release capture, or use **Disconnect**.

## Features

- Live JPEG screen streaming (~30 FPS)
- Full mouse control (move, click, scroll)
- Keyboard forwarding with modifier keys
- PIN pairing
- Fullscreen mode on Mac
- Widescreen-friendly scaling (letterboxed to preserve aspect ratio)

## Architecture

```
┌─────────────────┐         WebSocket (LAN)         ┌──────────────────────┐
│  Mac: DeskBridge │  ◄──── screen frames ─────────  │ Windows: Server      │
│  (Tauri app)     │  ──── mouse/keyboard ────────►  │ (screen + input)     │
└─────────────────┘                                 └──────────────────────┘
```

- **Protocol:** JSON messages over WebSocket (`crates/protocol`)
- **Screen capture:** DXGI via `scrap` (Windows)
- **Input injection:** `enigo` (Windows)
- **Mac UI:** Tauri 2 + vanilla HTML/JS

## Development

```bash
# Protocol + server (Windows build required for full server testing)
cd deskbridge
cargo build -p deskbridge-protocol
cargo build -p deskbridge-server

# Mac client dev mode (on macOS)
cd mac-client
npm install
npm run dev
```

### Server options

```
deskbridge-server --help

  -p, --port <PORT>   Port (default: 9478)
      --pin <PIN>     Fixed 6-digit PIN (auto-generated if omitted)
```

## Security notes

- DeskBridge is designed for **trusted home/office LANs**.
- Traffic is **not encrypted** by default (plain WebSocket). Do not expose port 9478 to the public internet.
- Always use the PIN. Regenerate by restarting the Windows server (unless you set a fixed `--pin`).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Mac can’t connect | Confirm both machines are on the same network; check Windows Firewall |
| Wrong PIN | Restart the server to get a new PIN, or use `--pin 123456` |
| Black screen | Ensure the Windows session is logged in and the monitor is not asleep |
| Laggy stream | Use wired Ethernet; reduce network load; stay on 5 GHz Wi‑Fi |

## License

MIT
