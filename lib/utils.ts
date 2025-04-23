import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case "Food":
      return "bg-orange-500"
    case "Salary":
      return "bg-emerald-500"
    case "Rent":
      return "bg-blue-500"
    case "Entertainment":
      return "bg-purple-500"
    case "Utilities":
      return "bg-yellow-500"
    case "Other Income":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}
