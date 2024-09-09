'use client';

import { useEffect, useState } from "react";
import SystemInfoComponent from "./components/system-info-component";
import DashboardTabs from "@/app/components/dashboard-tabs";
import { invoke } from '@tauri-apps/api/tauri';

export default function Page() {
  const [data, setData] = useState({
    cpu: [],
    overall_cpu: 0,
    ram: [0, 0],
    disk: [],
    network: [],
    processes: [],
  });

  useEffect(() => {
    const startWebSocket = async () => {
      try {
        await invoke("start_websocket_server");
        console.log("Started WebSocket server");
      } catch (e) {
        console.error("Failed to start WebSocket server:", e);
      }

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
    };

    startWebSocket();
  }, []);

  return (
    <div>
      <DashboardTabs data={data} />
    </div>
  );
}
