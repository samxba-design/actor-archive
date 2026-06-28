#[cfg(windows)]
use scrap::{Capturer, Display};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum CaptureError {
    #[error("screen capture is only supported on Windows")]
    Unsupported,
    #[cfg(windows)]
    #[error("display error: {0}")]
    Display(#[from] std::io::Error),
    #[error("no displays found")]
    NoDisplays,
    #[error("failed to encode frame as JPEG")]
    Encode,
}

pub struct ScreenCapture {
    #[cfg(windows)]
    capturer: Capturer,
    #[cfg(windows)]
    width: usize,
    #[cfg(windows)]
    height: usize,
}

impl ScreenCapture {
    pub fn primary() -> Result<Self, CaptureError> {
        #[cfg(not(windows))]
        {
            Err(CaptureError::Unsupported)
        }

        #[cfg(windows)]
        {
            let display = Display::primary().map_err(CaptureError::Display)?;
            let width = display.width();
            let height = display.height();
            let capturer = Capturer::new(display).map_err(CaptureError::Display)?;
            Ok(Self {
                capturer,
                width,
                height,
            })
        }
    }

    pub fn dimensions(&self) -> (u32, u32) {
        #[cfg(windows)]
        {
            (self.width as u32, self.height as u32)
        }
        #[cfg(not(windows))]
        {
            (0, 0)
        }
    }

    pub fn capture_jpeg(&mut self, quality: u8) -> Result<Vec<u8>, CaptureError> {
        #[cfg(not(windows))]
        {
            let _ = quality;
            Err(CaptureError::Unsupported)
        }

        #[cfg(windows)]
        {
            use std::io::ErrorKind;
            let frame = loop {
                match self.capturer.frame() {
                    Ok(frame) => break frame,
                    Err(error) if error.kind() == ErrorKind::WouldBlock => {
                        std::thread::sleep(std::time::Duration::from_millis(1));
                        continue;
                    }
                    Err(error) => return Err(CaptureError::Display(error)),
                }
            };

            let rgba = bgra_to_rgba(&frame, self.width, self.height);
            encode_jpeg(&rgba, self.width, self.height, quality).ok_or(CaptureError::Encode)
        }
    }
}

#[cfg(windows)]
fn bgra_to_rgba(bgra: &[u8], width: usize, height: usize) -> Vec<u8> {
    let mut rgba = vec![0u8; width * height * 4];
    for (src, dst) in bgra.chunks_exact(4).zip(rgba.chunks_exact_mut(4)) {
        dst[0] = src[2];
        dst[1] = src[1];
        dst[2] = src[0];
        dst[3] = 255;
    }
    rgba
}

#[cfg(windows)]
fn encode_jpeg(rgba: &[u8], width: usize, height: usize, quality: u8) -> Option<Vec<u8>> {
    use image::{codecs::jpeg::JpegEncoder, ExtendedColorType, ImageBuffer, Rgba};

    let image: ImageBuffer<Rgba<u8>, Vec<u8>> =
        ImageBuffer::from_raw(width as u32, height as u32, rgba.to_vec())?;
    let mut buffer = Vec::new();
    let mut encoder = JpegEncoder::new_with_quality(&mut buffer, quality);
    encoder
        .encode(
            image.as_raw(),
            width as u32,
            height as u32,
            ExtendedColorType::Rgba8,
        )
        .ok()?;
    Some(buffer)
}
