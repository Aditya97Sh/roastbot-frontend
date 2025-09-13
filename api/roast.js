export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, details, style } = req.body;

  if (!name || !details) {
    return res.status(400).json({ roast: "Name and details are required." });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY; // <--- load from env

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: `You are a witty comedian. Roast ${name} in a ${style} and clever way. Details: ${details}. Output ONE short sentence, light-hearted, not offensive.`
          }
        ]
      })
    });

    const data = await response.json();
    const roast = data?.choices?.[0]?.message?.content?.trim() || "No roast generated.";

    res.status(200).json({ roast });

  } catch (err) {
    console.error("Groq API call failed:", err);
    res.status(500).json
