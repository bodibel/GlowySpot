/**
 * Ár formázása HUF-ban
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * Időtartam formázása percből órákra és percekre
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} perc`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} óra`;
  }
  return `${hours} óra ${mins} perc`;
}

/**
 * Dátum formázása magyar formátumban
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Relatív idő formázása (pl. "2 órája", "3 napja")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'most';
  if (minutes < 60) return `${minutes} perce`;
  if (hours < 24) return `${hours} órája`;
  if (days < 7) return `${days} napja`;
  if (weeks < 4) return `${weeks} hete`;
  if (months < 12) return `${months} hónapja`;
  return `${years} éve`;
}

/**
 * Szolgáltatási kategória magyar neve
 */
export function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    hair: 'Fodrászat',
    nails: 'Körmös',
    cosmetics: 'Kozmetika',
    barber: 'Borbély',
    massage: 'Masszázs',
    tattoo: 'Tetoválás',
    piercing: 'Piercing',
  };
  return names[category] || category;
}
