"use client"

import { useState, useMemo } from "react"
import { Search, FileText, Hash, Percent } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample HSN data - in a real app, this would come from an API
const hsnData = [
  { code: "1001", description: "Wheat and meslin", rate: "0%" },
  { code: "1002", description: "Rye", rate: "0%" },
  { code: "1003", description: "Barley", rate: "0%" },
  { code: "1004", description: "Oats", rate: "0%" },
  { code: "1005", description: "Maize (corn)", rate: "0%" },
  { code: "1006", description: "Rice", rate: "0%" },
  { code: "1007", description: "Grain sorghum", rate: "0%" },
  { code: "1008", description: "Buckwheat, millet and canary seed; other cereals", rate: "0%" },
  { code: "2201", description: "Waters, including natural or artificial mineral waters", rate: "18%" },
  { code: "2202", description: "Waters, including mineral waters and aerated waters", rate: "12%" },
  { code: "2203", description: "Beer made from malt", rate: "28%" },
  { code: "2204", description: "Wine of fresh grapes", rate: "28%" },
  { code: "3004", description: "Medicaments consisting of mixed or unmixed products", rate: "12%" },
  { code: "3005", description: "Wadding, gauze, bandages and similar articles", rate: "12%" },
  { code: "6109", description: "T-shirts, singlets and other vests, knitted or crocheted", rate: "12%" },
  { code: "6110", description: "Jerseys, pullovers, cardigans, waistcoats", rate: "12%" },
  { code: "6203", description: "Men's or boys' suits, ensembles, jackets, blazers", rate: "12%" },
  { code: "6204", description: "Women's or girls' suits, ensembles, jackets, blazers", rate: "12%" },
  { code: "8471", description: "Automatic data processing machines and units thereof", rate: "18%" },
  { code: "8517", description: "Telephone sets, including telephones for cellular networks", rate: "12%" },
  { code: "8528", description: "Monitors and projectors, not incorporating television reception", rate: "18%" },
  { code: "9403", description: "Other furniture and parts thereof", rate: "18%" },
  { code: "9404", description: "Mattress supports; articles of bedding", rate: "18%" },
]

export default function Component() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) return hsnData

    const term = searchTerm.toLowerCase().trim()
    return hsnData.filter(
      (item) => item.code.toLowerCase().includes(term) || item.description.toLowerCase().includes(term),
    )
  }, [searchTerm])

  const getRateBadgeVariant = (rate: string) => {
    const numRate = Number.parseFloat(rate.replace("%", ""))
    if (numRate === 0) return "secondary"
    if (numRate <= 5) return "default"
    if (numRate <= 12) return "default"
    if (numRate <= 18) return "destructive"
    return "destructive"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">HSN Code Lookup</h1>
          <p className="text-lg text-gray-600">Search for HSN codes and their corresponding tax rates</p>
        </div>

        {/* Search Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Search className="h-5 w-5 text-blue-600" />
              Search HSN Codes
            </CardTitle>
            <CardDescription>
              Enter HSN code (e.g., "1001") or description (e.g., "wheat") to find matching results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by HSN code or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-colors"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Search Results
              </span>
              <Badge variant="outline" className="text-sm">
                {filteredResults.length} {filteredResults.length === 1 ? "result" : "results"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredResults.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="font-semibold text-gray-700">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          HSN Code
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Description
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Percent className="h-4 w-4" />
                          Tax Rate
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.map((item, index) => (
                      <TableRow key={item.code} className="hover:bg-blue-50/50 transition-colors">
                        <TableCell className="font-mono font-semibold text-blue-700">{item.code}</TableCell>
                        <TableCell className="text-gray-800 max-w-md">{item.description}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={getRateBadgeVariant(item.rate)} className="font-semibold">
                            {item.rate}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No results found</h3>
                <p className="text-gray-500">Try searching with a different HSN code or description</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Hash className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">HSN Codes</h3>
                <p className="text-sm text-gray-600">Harmonized System of Nomenclature for goods classification</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Descriptions</h3>
                <p className="text-sm text-gray-600">Detailed product descriptions for accurate classification</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Percent className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Tax Rates</h3>
                <p className="text-sm text-gray-600">Current GST rates applicable to each HSN code</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
