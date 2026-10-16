// Noms des mois (index 0 = Janvier)
export const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export function getMonthName(month) {
  return MONTH_NAMES[month - 1];
}
