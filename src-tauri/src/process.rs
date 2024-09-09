use sysinfo::{ProcessRefreshKind, ProcessesToUpdate, System};

pub fn fetch_process_info(
    sys: &mut System,
) -> Vec<(
    String, // Process name
    u32,    // Process PID
    f32,    // CPU usage
    u64,    // Memory usage
    u64,    // Virtual memory usage
    u64,    // Disk read bytes
    u64,    // Disk written bytes
    String, // Current working directory
    String, // Status
)> {
    // Refresh the system processes with CPU and memory info
    sys.refresh_processes_specifics(
        ProcessesToUpdate::All,
        ProcessRefreshKind::everything(),
    );

    // Iterate over all processes and collect their information
    sys.processes()
        .iter()
        .map(|(_, process)| {
            let name = process.name().to_string_lossy().to_string(); // Convert OsStr to String
            let pid = process.pid().as_u32();
            let cpu_usage = process.cpu_usage();
            let memory = process.memory(); // Resident Set Size (in bytes)
            let virtual_memory = process.virtual_memory(); // Virtual memory usage (in bytes)
            let disk_usage = process.disk_usage();
            let cwd = process
                .cwd()
                .map_or("Unknown".to_string(), |p| p.to_string_lossy().to_string());
            let status = format!("{:?}", process.status());

            (
                name,
                pid,
                cpu_usage,
                memory,
                virtual_memory,
                disk_usage.total_read_bytes,
                disk_usage.total_written_bytes,
                cwd,
                status,
            )
        })
        .collect()
}
