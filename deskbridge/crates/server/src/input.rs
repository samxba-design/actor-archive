use deskbridge_protocol::{KeyModifiers, MouseButton};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum InputError {
    #[error("remote input is only supported on Windows")]
    Unsupported,
}

pub struct RemoteInput {
    #[cfg(windows)]
    enigo: enigo::Enigo,
}

impl Default for RemoteInput {
    fn default() -> Self {
        Self::new()
    }
}

impl RemoteInput {
    pub fn new() -> Self {
        #[cfg(windows)]
        {
            Self {
                enigo: enigo::Enigo::new(),
            }
        }
        #[cfg(not(windows))]
        {
            Self {}
        }
    }

    pub fn move_mouse(&mut self, x: i32, y: i32) -> Result<(), InputError> {
        #[cfg(windows)]
        {
            use enigo::{MouseControllable, Mouse};
            self.enigo.mouse_move_to(x, y);
            Ok(())
        }
        #[cfg(not(windows))]
        {
            let _ = (x, y);
            Err(InputError::Unsupported)
        }
    }

    pub fn mouse_button(&mut self, button: MouseButton, pressed: bool) -> Result<(), InputError> {
        #[cfg(windows)]
        {
            use enigo::{MouseButton as EButton, MouseControllable, Mouse};
            let btn = match button {
                MouseButton::Left => EButton::Left,
                MouseButton::Right => EButton::Right,
                MouseButton::Middle => EButton::Middle,
            };
            if pressed {
                self.enigo.mouse_down(btn);
            } else {
                self.enigo.mouse_up(btn);
            }
            Ok(())
        }
        #[cfg(not(windows))]
        {
            let _ = (button, pressed);
            Err(InputError::Unsupported)
        }
    }

    pub fn mouse_scroll(&mut self, delta_x: i32, delta_y: i32) -> Result<(), InputError> {
        #[cfg(windows)]
        {
            use enigo::{MouseControllable, Mouse};
            if delta_y != 0 {
                self.enigo.mouse_scroll_y(delta_y);
            }
            if delta_x != 0 {
                self.enigo.mouse_scroll_x(delta_x);
            }
            Ok(())
        }
        #[cfg(not(windows))]
        {
            let _ = (delta_x, delta_y);
            Err(InputError::Unsupported)
        }
    }

    pub fn key(&mut self, key: &str, pressed: bool, modifiers: &KeyModifiers) -> Result<(), InputError> {
        #[cfg(windows)]
        {
            use enigo::{Key as EKey, KeyboardControllable, Keyboard};

            self.apply_modifiers(modifiers, pressed)?;

            if let Some(enigo_key) = map_key(key) {
                if pressed {
                    self.enigo.key_down(enigo_key);
                } else {
                    self.enigo.key_up(enigo_key);
                }
            }

            Ok(())
        }
        #[cfg(not(windows))]
        {
            let _ = (key, pressed, modifiers);
            Err(InputError::Unsupported)
        }
    }

    #[cfg(windows)]
    fn apply_modifiers(&mut self, modifiers: &KeyModifiers, pressed: bool) -> Result<(), InputError> {
        use enigo::{Key as EKey, KeyboardControllable, Keyboard};

        let pairs = [
            (modifiers.ctrl, EKey::Control),
            (modifiers.alt, EKey::Alt),
            (modifiers.shift, EKey::Shift),
            (modifiers.meta, EKey::Meta),
        ];

        for (active, key) in pairs {
            if active {
                if pressed {
                    self.enigo.key_down(key);
                } else {
                    self.enigo.key_up(key);
                }
            }
        }

        Ok(())
    }
}

#[cfg(windows)]
fn map_key(key: &str) -> Option<enigo::Key> {
    use enigo::Key;

    if key.len() == 1 {
        let ch = key.chars().next()?;
        return Some(Key::Layout(ch));
    }

    Some(match key {
        "Enter" | "Return" => Key::Return,
        "Backspace" => Key::Backspace,
        "Tab" => Key::Tab,
        "Escape" => Key::Escape,
        "Delete" => Key::Delete,
        "Home" => Key::Home,
        "End" => Key::End,
        "PageUp" => Key::PageUp,
        "PageDown" => Key::PageDown,
        "ArrowLeft" => Key::LeftArrow,
        "ArrowRight" => Key::RightArrow,
        "ArrowUp" => Key::UpArrow,
        "ArrowDown" => Key::DownArrow,
        " " | "Space" => Key::Space,
        "F1" => Key::F1,
        "F2" => Key::F2,
        "F3" => Key::F3,
        "F4" => Key::F4,
        "F5" => Key::F5,
        "F6" => Key::F6,
        "F7" => Key::F7,
        "F8" => Key::F8,
        "F9" => Key::F9,
        "F10" => Key::F10,
        "F11" => Key::F11,
        "F12" => Key::F12,
        "Control" | "Ctrl" => Key::Control,
        "Alt" => Key::Alt,
        "Shift" => Key::Shift,
        "Meta" | "OS" => Key::Meta,
        _ => Key::Layout(key.chars().next()?),
    })
}
