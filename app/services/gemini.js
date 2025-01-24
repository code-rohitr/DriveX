import { GoogleGenerativeAI } from '@google/generative-ai';

// Helper function to interact with the Gemini API
export async function GeminiService(content, question) {
  try {
    const genAI = new GoogleGenerativeAI('AIzaSyAHQzDAA5rje6Yya2QTHRlIP6cy-oPtz1o');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Give me well-structured, accurate answers to the question I'm providing.
      Provide the answers based on the document provided to you.
      Format the answer in clear, concise paragraphs and ensure the response is easy to read.

      Document content:
      ${content}

      Question:
      ${question}

      Your response should be:
      - Focused on answering the question with as much accuracy as possible.
      - Well-organized with headings or bullet points if needed.
      - Break down the answer logically if there are multiple parts to it.
      - leave a margin above every heading or new point.

      Please provide your response in a well-formatted way.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    return {
      content: responseText || "Failed to process response"
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      content: "Sorry, I couldn't analyze the document. Please try again."
    };
  }
}
