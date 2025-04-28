// This is a simplified version of OpenAI embeddings for the demo
// In a real app, you would use the actual OpenAI API

export class OpenAIEmbeddings {
  async embedQuery(text: string): Promise<number[]> {
    // In a real app, you would call the OpenAI API here
    // For demo purposes, we'll return a mock embedding
    return this.mockEmbedding(text);
  }

  async embedDocuments(documents: string[]): Promise<number[][]> {
    // In a real app, you would batch call the OpenAI API
    return Promise.all(documents.map((doc) => this.mockEmbedding(doc)));
  }

  private mockEmbedding(text: string): number[] {
    // Create a deterministic but unique embedding based on the text
    // This is just for demo purposes
    const embedding: number[] = [];
    const seed = this.hashString(text);

    for (let i = 0; i < 128; i++) {
      // Generate a pseudo-random number between -1 and 1
      const value = Math.sin(seed * (i + 1)) * 0.5;
      embedding.push(value);
    }

    return this.normalizeVector(embedding);
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  private normalizeVector(vector: number[]): number[] {
    const magnitude = Math.sqrt(
      vector.reduce((sum, val) => sum + val * val, 0)
    );
    return vector.map((val) => val / magnitude);
  }
}
