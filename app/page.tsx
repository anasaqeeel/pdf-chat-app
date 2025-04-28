"use client"

import { useState } from "react"
import PDFUploader from "@/components/pdf-uploader"
import ChatInterface from "@/components/chat-interface"
import DocumentViewer from "@/components/document-viewer"
import Header from "@/components/header"

export default function Home() {
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [documentLoaded, setDocumentLoaded] = useState(false)
  const [documentContent, setDocumentContent] = useState<string>("")
  const [documentName, setDocumentName] = useState<string>("")
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([])

  const handleFileUpload = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    setDocumentName(file.name)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload file")
      }

      setIsUploading(false)
      setIsProcessing(true)

      // Process the PDF (extract text, create embeddings)
      const processResponse = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename: file.name }),
      })

      if (!processResponse.ok) {
        throw new Error("Failed to process file")
      }

      const { content } = await processResponse.json()
      setDocumentContent(content)
      setIsProcessing(false)
      setDocumentLoaded(true)

      // Add initial system message
      setChatHistory([
        {
          role: "system",
          content: `I've analyzed your document "${file.name}". You can ask me any questions about it.`,
        },
      ])
    } catch (error) {
      console.error("Error uploading or processing file:", error)
      setIsUploading(false)
      setIsProcessing(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Header documentName={documentName} documentLoaded={documentLoaded} />

      {!documentLoaded ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <PDFUploader onFileUpload={handleFileUpload} isUploading={isUploading} isProcessing={isProcessing} />
        </div>
      ) : (
        <div className="flex-1 flex">
          <ChatInterface chatHistory={chatHistory} setChatHistory={setChatHistory} documentName={documentName} />
          <DocumentViewer content={documentContent} />
        </div>
      )}
    </main>
  )
}
