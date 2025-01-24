import OpenAI from "openai";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { fileDetails, excelData, userPrompt } = await req.json();

    // Build the prompt by including the Excel data
    // Adding additional instructions 
    const prompt = `
      Extracted Excel Data: ${excelData}

      User Prompt: ${userPrompt}
      
      Please respond based on the provided Excel data and the user prompt.
      Format the data properly. leave one line gap between each heading.
      use tables put margin of black color for each of the table rows.
      Each column should be aligned with the ones above and below it.
      always show the data of excel file in table format.
      fill empty cells with -.
      include proper line breaks to show tables.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
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
