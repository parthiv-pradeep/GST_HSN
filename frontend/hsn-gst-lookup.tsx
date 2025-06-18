"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"

// Sample HSN data - in a real app, this would come from an API
const hsnDatabase = {
  "1001": { description: "Wheat and meslin", gstRate: "0%" },
  "1006": { description: "Rice", gstRate: "0%" },
  "2201": { description: "Waters, including natural or artificial mineral waters", gstRate: "18%" },
  "2203": { description: "Beer made from malt", gstRate: "28%" },
  "3004": { description: "Medicaments consisting of mixed or unmixed products", gstRate: "12%" },
  "6109": { description: "T-shirts, singlets and other vests, knitted or crocheted", gstRate: "12%" },
  "6203": { description: "Men's or boys' suits, ensembles, jackets, blazers", gstRate: "12%" },
  "8409": { description: "Parts suitable for use solely or principally with spark-ignition engines", gstRate: "28%" },
  "8471": { description: "Automatic data processing machines and units thereof", gstRate: "18%" },
  "8517": { description: "Telephone sets, including telephones for cellular networks", gstRate: "12%" },
  "9403": { description: "Other furniture and parts thereof", gstRate: "18%" },
}

export default function Component() {
  const [hsnCode, setHsnCode] = useState("")
  const [searchResult, setSearchResult] = useState<{
    code: string
    description: string
    gstRate: string
  } | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "") // Only allow digits
    setHsnCode(value)
  }

  const handleSearch = () => {
    if (!hsnCode.trim()) return

    setHasSearched(true)
    const result = hsnDatabase[hsnCode as keyof typeof hsnDatabase]

    if (result) {
      setSearchResult({
        code: hsnCode,
        description: result.description,
        gstRate: result.gstRate,
      })
    } else {
      setSearchResult(null)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg mb-4">
            <span className="text-white text-2xl font-bold">HSN</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-12">HSN Code GST Rate Lookup</h1>

        {/* Search Section */}
        <div className="mb-8">
          <div className="flex gap-3 max-w-md mx-auto">
            <Input
              type="text"
              value={hsnCode}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter HSN Code (e.g., 8409)"
              className="flex-1 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              maxLength={8}
            />
            <Button
              onClick={handleSearch}
              className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!hsnCode.trim()}
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="max-w-4xl mx-auto">
            {searchResult ? (
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">HSN Code</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6">Description</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 px-6 text-right">GST Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-gray-50">
                        <TableCell className="font-mono font-medium text-blue-700 py-4 px-6">
                          {searchResult.code}
                        </TableCell>
                        <TableCell className="text-gray-800 py-4 px-6">{searchResult.description}</TableCell>
                        <TableCell className="text-right py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {searchResult.gstRate}
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No data found for this HSN code</div>
                <div className="text-gray-400 text-sm mt-2">Please check the HSN code and try again</div>
              </div>
            )}
          </div>
        )}

        {/* Sample codes for testing */}
        {!hasSearched && (
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <p className="text-gray-600 text-sm mb-4">Try these sample HSN codes:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.keys(hsnDatabase)
                .slice(0, 6)
                .map((code) => (
                  <button
                    key={code}
                    onClick={() => setHsnCode(code)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                  >
                    {code}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
