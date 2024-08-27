import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  const { question } = await request.json();

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        providers: 'cohere',
        text: `Tell me ${question}`,
        temperature: 0.2,
        max_tokens: 250,
      }),
    });

    const responseData = await response.json();
    const success = responseData?.cohere.status === 'success';

    if (!success) {
      throw new Error("Couldn't get answer from chatGPT");
    }
    const aiAnswer = responseData?.cohere?.generated_text;

    return NextResponse.json({ aiAnswer });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message });
  }
};
