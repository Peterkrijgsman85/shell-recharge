export default async function handler(req, res) {
  const { id } = req.query; // bijv. ?id=4452657

  try {
    const response = await fetch(
      `https://ui-map.shellrecharge.com/api/map/v2/locations/${id}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "API-verzoek mislukt" });
    }

    const data = await response.json();

    // Alleen de velden die we nodig hebben
    res.status(200).json({
      name: data.name,
      uid: data.uid
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Interne serverfout" });
  }
}
