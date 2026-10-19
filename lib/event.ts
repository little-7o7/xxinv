// Confirmed in the invitation copy supplied by the host.
export const event = {date: '2026-11-04', timeZone: 'Asia/Samarkand', startsAt: '2026-11-04T18:00:00+05:00' as string | null};
export function remaining(now: Date) {
  if (event.startsAt) {
    const seconds = Math.max(0, Math.floor((new Date(event.startsAt).getTime() - now.getTime()) / 1000));
    return {days: Math.floor(seconds / 86400), hours: Math.floor(seconds / 3600) % 24, minutes: Math.floor(seconds / 60) % 60, seconds: seconds % 60, finished: seconds === 0};
  }
  const parts = new Intl.DateTimeFormat('en-CA', {timeZone: event.timeZone, year:'numeric', month:'2-digit', day:'2-digit'}).formatToParts(now);
  const value = (type:string) => parts.find(part => part.type === type)!.value;
  const today = `${value('year')}-${value('month')}-${value('day')}`;
  return {days: Math.max(0, Math.round((Date.parse(event.date) - Date.parse(today))/86400000)), hours: 0, minutes: 0, seconds: 0, finished: today > event.date};
}
