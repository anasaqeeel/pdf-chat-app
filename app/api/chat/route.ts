import { type NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { readFile } from "fs/promises";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: NextRequest) {
  try {
    const { message, documentName, history } = await request.json();

    if (!message || !documentName) {
      return NextResponse.json(
        { error: "Message and document name are required" },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Convert the user's question to an embedding
    // 2. Search for similar chunks in your vector database
    // 3. Retrieve the most relevant chunks
    // 4. Send the chunks + question to the LLM

    // For demo purposes, we'll load the processed text file
    const textFilePath = join(
      process.cwd(),
      "processed",
      `${documentName}.txt`
    );
    let documentContent = "";

    try {
      documentContent = await readFile(textFilePath, "utf-8");
    } catch (error) {
      console.error("Error reading processed document:", error);
      return NextResponse.json(
        { error: "Error retrieving document content" },
        { status: 500 }
      );
    }

    // Simulate vector search by finding paragraphs that might contain the answer
    // In a real app, you would use your vector database for this
    const paragraphs = documentContent.split("\n\n");
    const relevantParagraphs = paragraphs.filter((p) =>
      p.toLowerCase().includes(message.toLowerCase().substring(0, 10))
    );

    // If no relevant paragraphs found, use the first few paragraphs as context
    const context =
      relevantParagraphs.length > 0
        ? relevantParagraphs.join("\n\n")
        : paragraphs.slice(0, 3).join("\n\n");

    // Format conversation history for the AI
    const formattedHistory = history
      .filter((msg: any) => msg.role !== "system")
      .map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }));

    // Generate response using OpenAI
    const prompt = `
You are an AI assistant that helps users understand their documents.
Answer the user's question based ONLY on the following context from their document:

${context}

If the answer is not in the context, say that you don't have enough information to answer the question.
Be concise and helpful.
`;

    const { text: response } = await generateText({
      model: openai("gpt-4o"),
      system: prompt,
      prompt: message,
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error generating chat response:", error);
    return NextResponse.json(
      { error: "Error generating response" },
      { status: 500 }
    );
  }
}
