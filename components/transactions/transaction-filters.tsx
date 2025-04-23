"use client"

import { useState } from "react"
import { CalendarIcon, FilterIcon, X } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FilterParams } from "@/types"
import { CATEGORIES } from "@/lib/constants"

interface TransactionFiltersProps {
  onFilterChange: (filters: FilterParams) => void
}

export default function TransactionFilters({ onFilterChange }: TransactionFiltersProps) {
  const [category, setCategory] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)

  const handleApplyFilters = () => {
    onFilterChange({
      category,
      startDate: startDate ? format(startDate, "yyyy-MM-dd") : "",
      endDate: endDate ? format(endDate, "yyyy-MM-dd") : "",
    })
  }

  const handleResetFilters = () => {
    setCategory("")
    setStartDate(undefined)
    setEndDate(undefined)
    onFilterChange({
      category: "",
      startDate: "",
      endDate: "",
    })
  }

  const hasActiveFilters = category || startDate || endDate

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setIsFiltersVisible(!isFiltersVisible)}>
          <FilterIcon className="mr-2 h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
              {[category, startDate, endDate].filter(Boolean).length}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleResetFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>

      {isFiltersVisible && (
        <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <Button className="md:col-span-3" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  )
}
