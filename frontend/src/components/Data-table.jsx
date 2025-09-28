

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function DataTable({ data, columns, searchKey, loading = false, onEdit, onDelete, onView }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState("asc")

  // Filter by search
  const filteredData = data.filter((item) => {
    if (!searchTerm || !searchKey) return true
    const value = item[searchKey]
    return String(value).toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0
    const aValue = String(a[sortColumn] || "")
    const bValue = String(b[sortColumn] || "")
    if (sortDirection === "asc") return aValue.localeCompare(bValue)
    else return bValue.localeCompare(aValue)
  })

  const handleSort = (column) => {
    if (sortColumn === column) setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-gradient-to-r from-slate-800/40 to-slate-700/40 backdrop-blur-sm animate-pulse rounded-xl border border-slate-600/30" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gradient-to-r from-slate-800/30 to-slate-700/30 backdrop-blur-sm animate-pulse rounded-xl border border-slate-600/20"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400/70" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-slate-800/40 backdrop-blur-sm border-slate-600/30 text-slate-100 placeholder:text-slate-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 rounded-xl transition-all duration-300 hover:bg-slate-800/50"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-12 px-6 bg-slate-800/40 backdrop-blur-sm border-slate-600/30 text-slate-300 hover:bg-slate-700/50 hover:border-cyan-400/50 hover:text-cyan-300 rounded-xl transition-all duration-300"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-600/30 bg-slate-800/20 backdrop-blur-sm overflow-hidden shadow-2xl">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-600/30 hover:bg-slate-700/20">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={`text-cyan-300 font-semibold py-4 px-6 ${
                    column.sortable ? "cursor-pointer hover:bg-slate-700/30 transition-all duration-300" : ""
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortColumn === column.key && (
                      <span className="text-cyan-400 font-bold text-sm animate-pulse">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
              {(onEdit || onDelete || onView) && (
                <TableHead className="w-[80px] text-cyan-300 font-semibold py-4 px-6">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-16 text-slate-400 bg-slate-800/10">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center">
                      <Search className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-lg">No courses found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((item, index) => (
                <TableRow
                  key={item._id}
                  className="border-b border-slate-600/20 hover:bg-slate-700/20 transition-all duration-300 group"
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className="py-4 px-6 text-slate-200 group-hover:text-slate-100 transition-colors duration-300"
                    >
                      {column.render ? column.render(item) : String(item[column.key] || "")}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <TableCell className="py-4 px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 p-0 text-slate-400 hover:text-cyan-300 hover:bg-slate-700/50 rounded-xl transition-all duration-300 hover:scale-110"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-slate-800/90 backdrop-blur-sm border-slate-600/30 text-slate-200 rounded-xl shadow-2xl"
                        >
                          {onView && (
                            <DropdownMenuItem
                              onClick={() => onView(item)}
                              className="hover:bg-slate-700/50 hover:text-cyan-300 transition-colors duration-300 rounded-lg"
                            >
                              View
                            </DropdownMenuItem>
                          )}
                          {onEdit && (
                            <DropdownMenuItem
                              onClick={() => onEdit(item)}
                              className="hover:bg-slate-700/50 hover:text-cyan-300 transition-colors duration-300 rounded-lg"
                            >
                              Edit
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              onClick={() => onDelete(item)}
                              className="text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors duration-300 rounded-lg"
                            >
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-slate-400 bg-slate-800/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-600/20">
          Showing <span className="text-cyan-400 font-semibold">{sortedData.length}</span> of{" "}
          <span className="text-cyan-400 font-semibold">{data.length}</span> courses
          {searchTerm && (
            <span className="text-slate-300">
              {" "}
              for "<span className="text-cyan-300 font-medium">{searchTerm}</span>"
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
