import fetch from "node-fetch";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { name, details, style } = req.body;

        try {
            const response = await fetch(
                "https://tokyo97-roastbot-backend.hf.space/api/predict/", 
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fn_index: 0, data: [name, details, style] })
                }
            );
            const result = await response.json();
            res.status(200).json({ roast: result.data[0] });
        } catch (err) {
            res.status(500).json({ roast: "Error generating roast. Please try later." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
