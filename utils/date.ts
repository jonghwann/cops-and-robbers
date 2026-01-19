import { format, isToday, isYesterday } from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatISODate(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export function formatChatTime(dateString: string) {
  const date = new Date(dateString);

  if (isToday(date)) {
    return format(date, 'a h:mm', { locale: ko });
  }

  if (isYesterday(date)) {
    return `어제 ${format(date, 'a h:mm', { locale: ko })}`;
  }

  return format(date, 'M/d a h:mm', { locale: ko });
}
