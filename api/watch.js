// api/location.js
export default async function handler(req, res) {
  const id = 4452657;

  const fetchOptions = {
    headers: {
      'User-Agent': 'VercelServer/1.0 (+https://vercel.com)',
      'Referer': 'https://ui-map.shellrecharge.com/'
    },
  };

  // Zet status om naar 1 = beschikbaar, 0 = bezet/onbeschikbaar
  function statusToNumber(status) {
    if (!status) return 0;
    const availableStatuses = ["AVAILABLE"];
    return availableStatuses.includes(status.toUpperCase()) ? 1 : 0;
  }

  try {
    const response = await fetch(`https://ui-map.shellrecharge.com/api/map/v2/locations/${id}`, fetchOptions);
    if (!response.ok) throw new Error(`Fout bij ophalen locatie ${id}: ${response.status}`);
    const loc = await response.json();
    const evses = loc.evses || [];

    // Tel het totaal aantal beschikbare laadpunten
    const available_count = evses.reduce((sum, evse) => sum + statusToNumber(evse.status), 0);

    // Alleen de variabele die Complicated kan gebruiken
    res.status(200).json({ available_count });

  } catch (error) {
    console.error('Fout in API-functie:', error);
    res.status(500).json({ error: 'Kon data niet ophalen', message: error.message });
  }
}
