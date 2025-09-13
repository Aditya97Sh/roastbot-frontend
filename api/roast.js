const fetch = require("node-fetch");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, details, style } = req.body;

  if (!name || !details) {
    return res.status(400).json({ roast: "Name and details are required." });
  }

  try {
    // Call Groq API or HF backend
    const hfResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions", 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            {
              role: "user",
              content: `Roast ${name} in a ${style} way. Details: ${details}. Output ONE short sentence, light-hearted.`
            }
          ]
        })
      }
    );

    const hfData = await hfResponse.json();
    const roast = hfData?.choices?.[0]?.message?.content || "No roast generated.";

    res.status(200).json({ roast });

  } catch (err) {
    console.error("API call failed:", err);
    res.status(500).json({ roast: "Error generating roast. Please try later." });
  }
};
