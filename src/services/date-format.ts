export function formatTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export function formatShortDate(isoDate: string): string {
  const date = new Date(isoDate);
  const isToday = date.toDateString() === new Date().toDateString();

  if (isToday) {
    return formatTime(isoDate);
  }

  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
}
