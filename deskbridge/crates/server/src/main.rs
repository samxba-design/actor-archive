mod capture;
mod input;
mod session;

use clap::Parser;
use deskbridge_protocol::DEFAULT_PORT;
use rand::Rng;
use tracing::info;

#[derive(Parser, Debug)]
#[command(name = "deskbridge-server", about = "DeskBridge Windows companion app")]
struct Args {
    /// TCP port for incoming Mac client connections
    #[arg(short, long, default_value_t = DEFAULT_PORT)]
    port: u16,

    /// 6-digit pairing PIN (auto-generated if omitted)
    #[arg(short, long)]
    pin: Option<String>,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| tracing_subscriber::EnvFilter::new("info")),
        )
        .init();

    let args = Args::parse();
    let pin = args.pin.unwrap_or_else(generate_pin);

    #[cfg(not(windows))]
    {
        eprintln!("DeskBridge server must run on Windows.");
        eprintln!("This binary captures the Windows desktop and forwards input.");
        std::process::exit(1);
    }

    #[cfg(windows)]
    {
        use local_ip_address::local_ip;
        use std::net::SocketAddr;

        let lan_ip = local_ip()
            .map(|ip| ip.to_string())
            .unwrap_or_else(|_| "127.0.0.1".to_string());
        let addr = SocketAddr::from(([0, 0, 0, 0], args.port));

        print_banner(&lan_ip, args.port, &pin);

        let runtime = tokio::runtime::Runtime::new()?;
        runtime.block_on(session::run_server(addr, pin))?;
    }

    Ok(())
}

fn generate_pin() -> String {
    let mut rng = rand::thread_rng();
    format!("{:06}", rng.gen_range(0..1_000_000))
}

fn print_banner(lan_ip: &str, port: u16, pin: &str) {
    println!();
    println!("  ╔══════════════════════════════════════════╗");
    println!("  ║         DeskBridge for Windows           ║");
    println!("  ╠══════════════════════════════════════════╣");
    println!("  ║  Status:   Waiting for Mac connection    ║");
    println!("  ║  Address:  {lan_ip:<27} ║");
    println!("  ║  Port:     {port:<27} ║");
    println!("  ║  PIN:      {pin:<27} ║");
    println!("  ╠══════════════════════════════════════════╣");
    println!("  ║  On your Mac, open DeskBridge and enter  ║");
    println!("  ║  the address, port, and PIN above.       ║");
    println!("  ╚══════════════════════════════════════════╝");
    println!();

    info!(%lan_ip, %port, %pin, "DeskBridge server ready");
}
