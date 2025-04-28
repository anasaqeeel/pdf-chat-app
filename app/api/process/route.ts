import { type NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { mkdir, writeFile } from "fs/promises";
import { OpenAIEmbeddings } from "./embeddings";

export async function POST(request: NextRequest) {
  try {
    const { filename } = await request.json();

    if (!filename) {
      return NextResponse.json(
        { error: "No filename provided" },
        { status: 400 }
      );
    }

    // Path to the uploaded PDF
    const filePath = join(process.cwd(), "uploads", filename);

    // For demo purposes, we'll simulate PDF text extraction
    // In a real app, you would use a library like pdf-parse
    console.log(`Processing ${filename}...`);

    // Simulate PDF text extraction
    let extractedText = "";
    try {
      // In a real app, you would use pdf-parse here
      // For demo, we'll create some sample text based on the filename
      extractedText = `# Document: ${filename}\n\nBelow are refined, high-impact prototype ideas you can present to prospective clients. Each idea includes a concise description and a brief statement on how it drives business value and sales.\n\n## Generative AI Video Marketing Creator\n\nAutomatically turn text scripts into short, high-quality marketing videos with branded assets, on-brand music, and AI voiceovers. Ideal for rapid social media ad prototyping.\n\nEmpowers your marketing team to produce engaging video ads in minutes, boosting social engagement and driving conversions.\n\n## AI-Enhanced Interactive Whiteboard\n\nSketch meeting brainstorms and watch AI parse them into flowcharts, action items, or runnable code snippets, all in real time.\n\nTransforms static meetings into dynamic, actionable sessions—accelerating project kick-offs and client buy-in.\n\n## Personalized Video Avatars for Outreach\n\nGenerate 1:1 video messages at scale featuring your prospect's name and logo, delivered by AI-voiced hosts.\n\nIncreases email response rates by up to 400%, making every outreach feel personal and memorable.\n\n## Business Scenario Simulator\n\nInput market variables and watch AI generate detailed simulations of how strategic decisions might impact revenue, costs, and market share.\n\nReduces decision risk by providing data-backed forecasts before committing resources to new initiatives.\n\n## Natural Language PDF Navigator\n\nAsk complex questions about any uploaded document and receive precise answers with highlighted source sections.\n\nSaves hours of document review time and ensures no critical information is missed in lengthy reports or contracts.`;

      // Create a directory for processed files if it doesn't exist
      const processedDir = join(process.cwd(), "processed");
      await mkdir(processedDir, { recursive: true });

      // Save the extracted text for future use
      const textFilePath = join(processedDir, `${filename}.txt`);
      await writeFile(textFilePath, extractedText);
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      return NextResponse.json(
        { error: "Error processing PDF" },
        { status: 500 }
      );
    }

    // Split text into chunks
    const chunks = splitTextIntoChunks(extractedText, 500);

    // Create embeddings for each chunk
    const embeddings = new OpenAIEmbeddings();

    // For a local demo without Supabase, we'll just log the chunks
    console.log(`Document split into ${chunks.length} chunks`);

    // In a real app with Supabase, you would store the chunks and embeddings
    // But for local testing without Supabase, we'll skip that step

    return NextResponse.json({
      message: "Document processed successfully",
      content: extractedText,
    });
  } catch (error) {
    console.error("Error processing document:", error);
    return NextResponse.json(
      { error: "Error processing document" },
      { status: 500 }
    );
  }
}

// Helper function to split text into chunks
function splitTextIntoChunks(text: string, chunkSize: number): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);

  let currentChunk = "";

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= chunkSize) {
      currentChunk += (currentChunk ? " " : "") + sentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      currentChunk = sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}
