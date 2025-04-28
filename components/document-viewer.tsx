"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface DocumentViewerProps {
  content: string
}

export default function DocumentViewer({ content }: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)

  // For demo purposes, split content into pages
  const contentLines = content.split("\n")
  const linesPerPage = 30
  const totalPages = Math.max(1, Math.ceil(contentLines.length / linesPerPage))

  const currentPageContent = contentLines.slice((currentPage - 1) * linesPerPage, currentPage * linesPerPage).join("\n")

  return (
    <div className="w-1/2 flex flex-col h-[calc(100vh-64px)]">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold">Document</h2>
        <Button variant="ghost" size="icon">
          <Download className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Prototype Ideas to Showcase Your Expertise</h1>

          <div className="prose max-w-none">
            {content ? (
              <div className="whitespace-pre-wrap">{currentPageContent}</div>
            ) : (
              <p className="text-muted-foreground">No document content available</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 p-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
