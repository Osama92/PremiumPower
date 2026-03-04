"use client"

import { LayoutGrid, List } from "lucide-react"

interface ViewToggleProps {
  view: "grid" | "list"
  onChange: (v: "grid" | "list") => void
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onChange("grid")}
        className={`p-1.5 rounded-md transition-all ${
          view === "grid" ? "bg-white shadow-sm text-[#0f2440]" : "text-gray-400 hover:text-gray-600"
        }`}
        title="Card view"
      >
        <LayoutGrid className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => onChange("list")}
        className={`p-1.5 rounded-md transition-all ${
          view === "list" ? "bg-white shadow-sm text-[#0f2440]" : "text-gray-400 hover:text-gray-600"
        }`}
        title="List view"
      >
        <List className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
