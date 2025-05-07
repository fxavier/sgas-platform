import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, formatStr: string = 'PPP') {
  const dateObj = date instanceof Date ? date : new Date(date);
  return format(dateObj, formatStr, { locale: ptBR });
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getRandomColor(str: string) {
  // Generate a consistent color based on a string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const h = hash % 360;
  return `hsl(${h}, 70%, 80%)`;
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getStatusDisplay(status: string) {
  const statusMap: Record<string, string> = {
    'completed': 'Concluído',
    'in-progress': 'Em Andamento',
    'delayed': 'Atrasado',
    'pending': 'Pendente'
  };
  
  return statusMap[status] || status;
}