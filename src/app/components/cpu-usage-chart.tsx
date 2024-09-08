"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ChartConfig, ChartContainer } from "@/app/components/ui/chart";

export const description = "A radial chart with text";

const chartConfig = {
  visitors: {
    label: "CPU Usage",
  },
  safari: {
    label: "Overall CPU",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function CpuUsageChart({ overallCpuUsage }: { overallCpuUsage: number }) {
  const chartData = [
    { cpu: "Overall CPU", usage: overallCpuUsage, fill: "var(--color-safari)" },
  ];

  const endAngle = (overallCpuUsage / 100) * 365;

  return (
    <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
            <CardTitle>CPU Usage</CardTitle>
            <CardDescription>Real-time CPU utilization</CardDescription>
        </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={endAngle}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="usage" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {overallCpuUsage.toFixed(2)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          CPU Usage
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
