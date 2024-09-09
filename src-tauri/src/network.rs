use sysinfo::Networks;
use tokio::time::Interval;

pub async fn fetch_network_usage(
    networks: &mut Networks,
    interval: &mut Interval,
) -> Vec<(String, u64, u64, u64, u64)> {
    // Refresh network data initially
    networks.refresh_list();
    networks.refresh();

    // Capture the initial data
    let initial_data: Vec<(String, u64, u64)> = networks
        .iter()
        .map(|(interface_name, data)| {
            (
                interface_name.to_string(),
                data.total_received(),
                data.total_transmitted(),
            )
        })
        .collect();

    // Wait for the interval (e.g., 500ms) before checking the data again
    interval.tick().await;

    // Refresh the network data again
    networks.refresh();

    // Capture the data after the interval
    let new_data: Vec<(String, u64, u64)> = networks
        .iter()
        .map(|(interface_name, data)| {
            (
                interface_name.to_string(),
                data.total_received(),
                data.total_transmitted(),
            )
        })
        .collect();

    // Calculate the total and speed
    initial_data
        .into_iter()
        .zip(new_data.into_iter())
        .map(|((name1, recv1, trans1), (_name2, recv2, trans2))| {
            let total_received = recv2;
            let total_transmitted = trans2;

            // Calculate speed (difference in bytes over the interval time)
            let download_speed = (recv2 - recv1) * 2; // Multiply by 2 for bytes per second
            let upload_speed = (trans2 - trans1) * 2;

            // Return the network interface name, total data, and speeds
            (
                name1,
                total_received,
                total_transmitted,
                download_speed,
                upload_speed,
            )
        })
        .collect()
}
