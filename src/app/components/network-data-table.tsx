import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Network, ArrowDownToLine, ArrowUpFromLine, Download, Upload } from "lucide-react"

const formatBytes = (bytes: number, isSpeed: boolean = false) => {
  if (bytes === 0) return '0 Bytes' + (isSpeed ? '/s' : '')
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i] + (isSpeed ? '/s' : '')
}


export default function NetworkDataTable({ networkData }: { networkData: any[] }) {
    return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Network Interfaces</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25%]">Interface</TableHead>
              <TableHead className="text-right">Total Received</TableHead>
              <TableHead className="text-right">Total Transmitted</TableHead>
              <TableHead className="text-right">Download Speed</TableHead>
              <TableHead className="text-right">Upload Speed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {networkData.map(([name, received, transmitted, downloadSpeed, uploadSpeed], index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <Network className="h-5 w-5 text-muted-foreground" />
                    <span>{name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <ArrowDownToLine className="h-4 w-4 text-green-500" />
                    <span>{formatBytes(received)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <ArrowUpFromLine className="h-4 w-4 text-blue-500" />
                    <span>{formatBytes(transmitted)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Download className="h-4 w-4 text-purple-500" />
                    <span>{formatBytes(downloadSpeed, true)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Upload className="h-4 w-4 text-orange-500" />
                    <span>{formatBytes(uploadSpeed, true)}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}