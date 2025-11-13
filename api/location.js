export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const response = await fetch(
      `https://ui-map.shellrecharge.com/api/map/v2/locations/${id}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "API-verzoek mislukt" });
    }

    const data = await response.json();

    // Controleer of er evses-data aanwezig is
    const evses = data.evses || [];

    res.status(200).json({
      name: data.name,
      evse_1_status: evses[0]?.status || "Onbekend",
      evse_2_status: evses[1]?.status || "Onbekend"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Interne serverfout" });
  }
}
