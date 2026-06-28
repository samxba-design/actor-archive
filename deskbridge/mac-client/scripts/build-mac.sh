#!/usr/bin/env bash
set -euo pipefail

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "DeskBridge Mac app must be built on macOS."
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/mac-client"

if ! command -v cargo >/dev/null; then
  echo "Install Rust from https://rustup.rs/"
  exit 1
fi

npm install
npm run build

echo ""
echo "Build complete. Look for:"
echo "  src-tauri/target/release/bundle/macos/DeskBridge.app"
echo "  src-tauri/target/release/bundle/dmg/*.dmg"
