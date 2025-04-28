"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Upload } from 'lucide-react'

interface PDFUploaderProps {
  onFileUpload: (file: File) => void
  isUploading: boolean
  isProcessing: boolean
}

export default function PDFUploader({ onFileUpload, isUploading, isProcessing }: PDFUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        if (file.type === "application/pdf") {
          onFileUpload(file)
        } else {
          alert("Please upload a PDF file")
        }
      }
    },
    [onFileUpload],
  )

  // Fix: Use the correct type for accept
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isUploading || isProcessing,
    // No need to explicitly define these as they have default implementations
    // onDragEnter, onDragLeave, onDragOver, multiple
  })

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">PDF Chat</h1>
          <p className="text-muted-foreground">Upload a PDF to chat with it using AI</p>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          }`}
        >
          <input {...getInputProps()} id="file-upload" />

          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
              <p>Uploading PDF...</p>
            </div>
          ) : isProcessing ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
              <p>Processing document...</p>
              <p className="text-sm text-muted-foreground mt-2">
                Extracting text, creating embeddings, and setting up the chat...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p>Drag & drop a PDF here, or click to select</p>
              <p className="text-sm text-muted-foreground mt-2">Your document will be processed securely</p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <Button
            className="w-full"
            disabled={isUploading || isProcessing}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            {isUploading ? "Uploading..." : isProcessing ? "Processing..." : "Select PDF"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}