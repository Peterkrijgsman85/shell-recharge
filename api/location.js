// api/locations.js
export default async function handler(req, res) {
  const ids = [4452657, 5036306, 5033623, 3302883];

  const fetchOptions = {
    headers: {
      'User-Agent': 'VercelServer/1.0 (+https://vercel.com)',
      'Referer': 'https://ui-map.shellrecharge.com/'
    },
  };

  // Datum formatter in Nederlandse tijd
  function formatDateAmsterdam(isoString) {
    if (!isoString) return "Onbekend";
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('nl-NL', {
        timeZone: 'Europe/Amsterdam',
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(date);
    } catch {
      return isoString;
    }
  }

  // Vertaal statuswaarden naar NL
  function translateStatus(status) {
    if (!status) return "Onbekend";
    const map = {
      AVAILABLE: "Beschikbaar",
      OCCUPIED: "Bezet",
      CHARGING: "Bezig met laden",
      UNAVAILABLE: "Niet beschikbaar",
      OUTOFORDER: "Defect",
      UNKNOWN: "Onbekend"
    };
    return map[status.toUpperCase()] || status;
  }

  try {
    const results = await Promise.all(ids.map(async id => {
      const response = await fetch(`https://ui-map.shellrecharge.com/api/map/v2/locations/${id}`, fetchOptions);
      if (!response.ok) throw new Error(`Fout bij ophalen locatie ${id}: ${response.status}`);
      const loc = await response.json();
      const evses = loc.evses || [];
      const address = loc.address || {};

      return {
        id,
        address: address.streetAndNumber || "Onbekend",
        evse_1_status: translateStatus(evses[0]?.status),
        evse_2_status: translateStatus(evses[1]?.status),
        evse_1_updated: formatDateAmsterdam(evses[0]?.updated),
        evse_2_updated: formatDateAmsterdam(evses[1]?.updated)
      };
    }));

    res.status(200).json(results);
  } catch (error) {
    console.error('Fout in API-functie:', error);
    res.status(500).json({ error: 'Kon data niet ophalen', message: error.message });
  }
}
