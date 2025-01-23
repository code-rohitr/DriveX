import OpenAI from "openai";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { fileDetails, excelData, userPrompt } = await req.json();

    // Build the prompt by including the Excel data
    const prompt = `
      Extracted Excel Data: ${excelData}

      User Prompt: ${userPrompt}
      
      Please respond based on the provided Excel data and the user prompt.
    `;

    // Call the OpenAI API with the composed prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // You can switch to 'gpt-4' if you have access
      messages: [{ role: 'user', content: prompt }],
    });

    return new Response(JSON.stringify({ reply: response.choices[0].message.content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to get response from OpenAI' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
