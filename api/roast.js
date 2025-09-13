const fetch = require("node-fetch");

module.exports = async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, details, style } = req.body;

  if (!name || !details) {
    return res.status(400).json({ roast: "Name and details are required." });
  }

  try {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
            content: `You are a witty comedian. Roast ${name} in a ${style}, funny and clever way. Details: ${details}. Output ONE short, light-hearted sentence.`
          }
        ]
      })
    });

    const data = await groqResponse.json();
    const roast = data?.choices?.[0]?.message?.content?.trim();

    if (!roast) {
      console.error("Groq API returned invalid response:", data);
      return res.status(500).json({ roast: "Groq API returned no valid roast." });
    }

    res.status(200).json({ roast });

  } catch (err) {
    console.error("Groq API call failed:", err);
    res.status(500).json({ roast: "Error generating roast. Please try later." });
  }
};
