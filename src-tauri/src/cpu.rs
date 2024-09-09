use sysinfo::System;
use tokio::time::Interval;

pub async fn fetch_cpu_usage(interval: &mut Interval, sys: &mut System) -> (f32, Vec<f32>) {

    // Wait for the interval to tick
    interval.tick().await;
    sys.refresh_cpu_all(); // Refresh CPU usage data

    // Collect CPU usage for all cores
    let cpu_usages: Vec<f32> = sys.cpus().iter().map(|cpu| cpu.cpu_usage()).collect();

    // Calculate overall CPU usage as the average of all cores
    let overall_cpu_usage = cpu_usages.iter().sum::<f32>() / cpu_usages.len() as f32;

    (overall_cpu_usage, cpu_usages) // Return overall CPU usage and per-core usage
}
