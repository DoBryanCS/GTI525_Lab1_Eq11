# GTI525 — Laboratoire 1 — Équipe 11

Application web (React + Vite + Tailwind CSS) qui affiche les données météo historiques
des principaux aéroports internationaux canadiens, à partir des fichiers CSV fournis.

## Lancer l'application

```bash
npm install
npm run dev
```
Ouvrir ensuite l'adresse affichée dans le terminal (par défaut http://localhost:5173).

## Organisation du code

| Fichier | Rôle |
|---|---|
| `public/data/*.csv.js` | Fichiers CSV fournis, chargés comme variables JavaScript |
| `src/utils/csv.js` | Analyse (parsing) d'un texte CSV |
| `src/utils/weatherData.js` | Extraction des stations, des données mensuelles et calcul des statistiques |
| `src/models/WeatherStation.js` | Modèle d'une station météo |
| `src/components/` | Composants d'interface (en-tête, menu, plage de dates, vues Données et Statistiques, pied de page) |
| `src/App.jsx` | Composant principal : état de l'application et mise en page |
