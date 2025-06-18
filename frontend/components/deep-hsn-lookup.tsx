"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Component() {
  const [hsnCode, setHsnCode] = useState("")
  const [searchResult, setSearchResult] = useState<{
    code: string
    description: string
    gstRate: string
  } | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "") // Only allow digits
    setHsnCode(value)
  }

  const handleSearch = async () => {
    if (!hsnCode.trim()) return

    setIsLoading(true)
    setHasSearched(true)

    try {
      // Call your backend API with correct URL
      const response = await fetch(`http://127.0.0.1:8080?hsn_code=${hsnCode}`)
      const data = await response.json()

      if (response.ok && data.hsn_code) {
        setSearchResult({
          code: data.hsn_code,
          description: data.description,
          gstRate: data.gst_rate,
        })
      } else {
        setSearchResult(null)
      }
    } catch (error) {
      console.error('Error fetching HSN data:', error)
      setSearchResult(null)
    }

    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const getGstRateColor = (rate: string) => {
    const numRate = Number.parseFloat(rate.replace("%", ""))
    if (numRate === 0) return "bg-gray-100 text-gray-800"
    if (numRate <= 5) return "bg-green-100 text-green-800"
    if (numRate <= 12) return "bg-blue-100 text-blue-800"
    if (numRate <= 18) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar - Your Original Design */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold text-blue-800">
                  Deep <span className="text-blue-950">HSN</span>
                </h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Your Original Design */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Card - Your Original Design */}
        <Card className="shadow-lg border-0 bg-white mb-8">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-900">HSN Code GST Rate Lookup</CardTitle>
            <p className="text-gray-600 mt-2">Enter an HSN code to find its description and applicable GST rate</p>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Input
                type="text"
                value={hsnCode}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter HSN Code (e.g., 8409)"
                className="flex-1 h-12 text-base border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-lg"
                maxLength={8}
                disabled={isLoading}
              />
              <Button
                onClick={handleSearch}
                className="h-12 px-8 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
                disabled={!hsnCode.trim() || isLoading}
              >
                <Search className="h-4 w-4 mr-2" />
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section - Your Original Design */}
        {hasSearched && (
          <div className="space-y-6">
            {isLoading ? (
              <Card className="shadow-lg border-0 bg-white">
                <CardContent className="py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Searching for HSN code...</p>
                  </div>
                </CardContent>
              </Card>
            ) : searchResult ? (
              <Card className="shadow-lg border-0 bg-white overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 border-b">
                          <TableHead className="font-semibold text-gray-700 py-4 px-6 text-left">HSN Code</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-4 px-6 text-left">Description</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-4 px-6 text-center">GST Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-mono font-semibold text-teal-700 py-6 px-6 text-lg">
                            {searchResult.code}
                          </TableCell>
                          <TableCell className="text-gray-800 py-6 px-6 leading-relaxed">
                            {searchResult.description}
                          </TableCell>
                          <TableCell className="py-6 px-6 text-center">
                            <span
                              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getGstRateColor(searchResult.gstRate)}`}
                            >
                              {searchResult.gstRate}
                            </span>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg border-0 bg-white">
                <CardContent className="py-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No data found for this HSN Code</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Please check the HSN code and try again. Make sure you're entering a valid numeric HSN code.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Sample Codes Section - Your Original Design */}
        {!hasSearched && (
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="py-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Try these sample HSN codes</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {["01", "0101", "01011010", "0102", "010121", "01012100", "010129", "01012910"].map((code) => (
                    <button
                      key={code}
                      onClick={() => setHsnCode(code)}
                      className="px-4 py-2 text-sm bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition-colors font-mono font-medium border border-teal-200"
                    >
                      {code}
                    </button>
                  ))}
                </div>
                <p className="text-gray-500 text-sm mt-4">Click on any code above to auto-fill the search field</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}