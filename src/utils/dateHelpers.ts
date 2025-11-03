import { format, subMonths, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date: Date | string, pattern = 'dd/MM/yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, pattern, { locale: es });
};

export const formatDateShort = (date: Date | string): string => {
  return formatDate(date, 'dd MMM');
};

export const formatDateLong = (date: Date | string): string => {
  return formatDate(date, "dd 'de' MMMM, yyyy");
};

export const getPresetDateRange = (preset: 'latest' | 'month' | '3months' | 'all') => {
  const endDate = new Date();
  let startDate: Date | null = null;

  switch (preset) {
    case 'latest':
      // Para latest no usamos rango de fechas
      startDate = null;
      break;
    case 'month':
      startDate = subMonths(endDate, 1);
      break;
    case '3months':
      startDate = subMonths(endDate, 3);
      break;
    case 'all':
      startDate = null;
      break;
  }

  return { startDate, endDate };
};

export const isDateInRange = (
  date: string | Date,
  startDate: Date | null,
  endDate: Date | null
): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (startDate && dateObj < startDate) return false;
  if (endDate && dateObj > endDate) return false;

  return true;
};
