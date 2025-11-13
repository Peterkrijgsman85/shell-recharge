export default async function handler(req, res) {
  // drie vaste ID’s
  const ids = [4452657, 5036306, 5036307];

  try {
    const responses = await Promise.all(
      ids.map(id =>
        fetch(`https://ui-map.shellrecharge.com/api/map/v2/locations/${id}`)
      )
    );

    const data = await Promise.all(responses.map(r => r.json()));

    const cleaned = data.map((loc, i) => {
      const evses = loc.evses || [];
      return {
        id: ids[i],
        name: loc.name,
        evse_1_status: evses[0]?.status || "Onbekend",
        evse_2_status: evses[1]?.status || "Onbekend",
        evse_1_updated: evses[0]?.updated || "Onbekend",
        evse_2_updated: evses[1]?.updated || "Onbekend"
      };
    });

    res.status(200).json(cleaned);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kon gegevens niet ophalen" });
  }
}
