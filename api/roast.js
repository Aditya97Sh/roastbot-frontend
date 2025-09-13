export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, details, style } = req.body;

    if (!name || !details) {
        return res.status(400).json({ roast: "Name and details are required." });
    }

    try {
        const response = await fetch(
            "https://tokyo97-roastbot-backend.hf.space/api/predict/", 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fn_index: 0,  // Gradio predict function index
                    data: [name, details, style]
                })
            }
        );

        const data = await response.json();

        // Gradio returns result in data[0]
        res.status(200).json({ roast: data.data[0] || "No roast generated." });

    } catch (error) {
        console.error("HF API call failed:", error);
        res.status(500).json({ roast: "Error generating roast. Please try later." });
    }
}
