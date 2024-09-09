'use client';

import { useEffect, useState } from "react";
import { invoke } from '@tauri-apps/api/tauri';
import { CpuUsageChart } from "./cpu-usage-chart";
import { CpuCoresChart } from "./cpu-cores-chart";
import { MemoryUsageChart } from "./memory-usage-chart";
import { DiskUsageCard } from "./disk-usage-chart";
import NetworkDataTable from "./network-data-table";
import ProcessTable from "./process-data-table";

export default function SystemInfoComponent() {
  const [data, setData] = useState({ cpu: [], overall_cpu: 0, ram: [0, 0], disk: [], network: [], processes: [] });

  useEffect(() => {
    invoke("start_websocket_server")
      .then(() => console.log("Started WebSocket server"))
      .catch((e) => console.error("Failed to start WebSocket server:", e));

    const ws = new WebSocket("ws://127.0.0.1:9001");

    ws.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">System Usage</h1>
{console.log(data)}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[300px]">
          <CpuUsageChart overallCpuUsage={data.overall_cpu} />
        </div>

        <div className="flex-1 min-w-[300px]">
          <MemoryUsageChart usedRam={data.ram[0]} totalRam={data.ram[1]} />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[300px]">
          <DiskUsageCard disks={data.disk} />
        </div>
        <div className="flex-1 min-w-[300px]">
          <CpuCoresChart cpuCoresUsage={data.cpu} />
        </div>
      </div>

      <NetworkDataTable networkData={data.network} />

      <ProcessTable processes={data.processes} />







      {/* <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Overall CPU Usage</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">{data.overall_cpu.toFixed(2)}%</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">CPU Usage per Core</h2>
        <ul className="list-disc list-inside">
          {data.cpu.map((usage: number, index) => (
            <li key={index} className="text-lg text-gray-700 dark:text-gray-300">
              CPU {index + 1}: {(usage as number).toFixed(2)}%
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">RAM Usage</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Used RAM: {(data.ram[0] / 1024 / 1024).toFixed(2)} GB / Total RAM: {(data.ram[1] / 1024 / 1024).toFixed(2)} GB
        </p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Disk Usage</h2>
        <ul className="list-disc list-inside">
          {data.disk.map((disk, index) => (
            <li key={index} className="text-lg text-gray-700 dark:text-gray-300">
              Disk {disk[0]}: {(disk[2] / 1024 / 1024 / 1024).toFixed(2)} GB free of {(disk[1] / 1024 / 1024 / 1024).toFixed(2)} GB
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}