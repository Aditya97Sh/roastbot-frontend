export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, details, style } = req.body;

  if (!name || !details) {
    return res.status(400).json({ roast: "Name and details are required." });
  }

  try {
    // Correct HF Space endpoint
    const hfResponse = await fetch(
      "https://hf.space/embed/tokyo97/roastbot-backend/api/predict/", 
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fn_index: 0,
          data: [name, details, style]
        })
      }
    );

    const hfData = await hfResponse.json();

    const roast = hfData?.data?.[0];
    if (!roast) {
      console.error("HF API returned invalid response:", hfData);
      return res.status(500).json({ roast: "HF API returned no valid roast." });
    }

    res.status(200).json({ roast });

  } catch (err) {
    console.error("HF API call failed:", err);
    res.status(500).json({ roast: "Error generating roast. Please try later." });
  }
}
