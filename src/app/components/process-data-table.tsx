"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { ArrowUpDown, Search, ChevronRight, ChevronLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"

type Process = [
  string,  // Process name
  number,  // PID
  number,  // CPU usage
  number,  // Memory usage
  number,  // Virtual memory usage
  number,  // Total read bytes
  number,  // Total written bytes
  string,  // Current working directory
  string   // Status
]

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

const formatPercentage = (value: number) => {
  return value.toFixed(2) + "%"
}

const columnNames = [
  "Name", "PID", "CPU Usage", "Memory", "Virtual Memory",
  "Total Read", "Total Written", "CWD", "Status"
]

export default function ProcessTable({ processes }: { processes: Process[] }) {
  const [sortColumn, setSortColumn] = useState<number>(0)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleColumns, setVisibleColumns] = useState<number[]>([0, 1, 2, 3, 8])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const handleSort = (columnIndex: number) => {
    if (sortColumn === columnIndex) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnIndex)
      setSortDirection("asc")
    }
  }

  const sortedAndFilteredProcesses = useMemo(() => {
    return [...processes]
      .sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
        if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
        return 0
      })
      .filter((process) =>
        process[0].toLowerCase().includes(searchTerm.toLowerCase())
      )
  }, [processes, sortColumn, sortDirection, searchTerm])

  const paginatedProcesses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedAndFilteredProcesses.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedAndFilteredProcesses, currentPage, itemsPerPage])

  const totalPages = Math.ceil(sortedAndFilteredProcesses.length / itemsPerPage)

  return (
    <div className="container mx-auto py-4 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold">Process List</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search processes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <Select
            value={visibleColumns.join(",")}
            onValueChange={(value) => setVisibleColumns(value.split(",").map(Number))}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select columns" />
            </SelectTrigger>
            <SelectContent>
              {columnNames.map((name, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((columnIndex) => (
                <TableHead key={columnIndex}>
                  <Button variant="ghost" onClick={() => handleSort(columnIndex)}>
                    {columnNames[columnIndex]} <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProcesses.map((process, index) => (
              <TableRow key={index}>
                {visibleColumns.map((columnIndex) => (
                  <TableCell key={columnIndex}>
                    {columnIndex === 0 && process[columnIndex]}
                    {columnIndex === 1 && process[columnIndex]}
                    {columnIndex === 2 && formatPercentage(process[columnIndex])}
                    {(columnIndex === 3 || columnIndex === 4) && formatBytes(process[columnIndex])}
                    {(columnIndex === 5 || columnIndex === 6) && formatBytes(process[columnIndex])}
                    {columnIndex === 7 && (
                      <span className="max-w-[150px] truncate inline-block" title={process[columnIndex]}>
                        {process[columnIndex]}
                      </span>
                    )}
                    {columnIndex === 8 && process[columnIndex]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}