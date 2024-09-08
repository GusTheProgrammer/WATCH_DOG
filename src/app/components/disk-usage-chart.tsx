'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';

export function DiskUsageCard({ disks }: { disks: any[] }) {
    // Function to convert bytes to GB or TB
    const convertToGBOrTB = (bytes: number) => {
        const GB = bytes / 1024 ** 3;
        if (GB >= 1024) {
            return { value: (GB / 1024).toFixed(2), unit: 'TB' }; // Convert to TB if greater than 1024 GB
        }
        return { value: GB.toFixed(2), unit: 'GB' }; // Otherwise, use GB
    };

    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>Disk Usage</CardTitle>
                <CardDescription>
                    Overview of disk usage across all disks
                </CardDescription>
            </CardHeader>
            <CardContent>
                {disks.map((disk, index) => {
                    const diskName = disk[0] || '';
                    const totalSpace = disk[1];
                    const availableSpace = disk[2];
                    const fileSystem = disk[3];
                    const diskKind = disk[4]; 
                    const mountPoint = disk[5] || ''; 

                    const usedSpace = totalSpace - availableSpace;

                    const usedSpaceConverted = convertToGBOrTB(usedSpace);
                    const totalSpaceConverted = convertToGBOrTB(totalSpace);

                    const usedPercentage = Number(((usedSpace / totalSpace) * 100).toFixed(2));

                    return (
                        <div key={index} className="mb-4">
                            {/* Disk Name and Mount Point */}
                            <div className="flex justify-between">
                                <span className="font-medium">
                                    {diskName} ({mountPoint}) - {diskKind}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {usedSpaceConverted.value} {usedSpaceConverted.unit} used of{' '}
                                    {totalSpaceConverted.value} {totalSpaceConverted.unit}
                                </span>
                            </div>

                            {/* Progress bar showing disk usage */}
                            <Progress value={usedPercentage} />

                            {/* Usage Percentage */}
                            <p className="text-right text-sm text-muted-foreground mt-1">
                                {usedPercentage}% used
                            </p>

                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
