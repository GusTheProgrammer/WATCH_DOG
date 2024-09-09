use sysinfo::Disks; 

// Function to fetch disk usage information
pub fn fetch_disk_usage(disks: &mut Disks) -> Vec<(String, u64, u64, String, String, String)> {
    disks.refresh_list(); // Recompute the disk list to make sure we have the latest information

    // Collect the disk information: name, total space, and available space
    disks
        .list()
        .iter()
        .map(|disk| {
            let name = disk.name().to_str().unwrap_or("Unknown").to_string();
            let total_space = disk.total_space();
            let available_space = disk.available_space();
            let file_system = disk.file_system().to_str().unwrap_or("Unknown").to_string();
            let disk_kind = format!("{:?}", disk.kind());
            let mount_point = disk.mount_point().to_str().unwrap_or("Unknown").to_string();
            (name, total_space, available_space, file_system, disk_kind, mount_point)
        })
        .collect()
}
