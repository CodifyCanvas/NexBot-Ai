import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getColorByLetter(name: string) {
  const letter = name.charAt(0).toLowerCase();

  if (/^[a-d]$/.test(letter)) {
    return "bg-green-300/70 text-green-800 dark:bg-green-800/70 dark:text-green-400";
  } else if (/^[e-h]$/.test(letter)) {
    return "bg-blue-400/50 text-blue-800 dark:bg-blue-800/50 dark:text-blue-400";
  } else if (/^[i-m]$/.test(letter)) {
    return "bg-red-300/50 text-red-800 dark:bg-red-800/50 dark:text-red-400";
  } else if (/^[n-r]$/.test(letter)) {
    return "bg-purple-400/50 text-purple-800 dark:bg-purple-800/50 dark:text-purple-400";
  } else if (/^[s-v]$/.test(letter)) {
    return "bg-orange-300/50 text-orange-800 dark:bg-orange-800/50 dark:text-orange-400";
  } else if (/^[w-z]$/.test(letter)) {
    return "bg-yellow-400/50 text-yellow-800 dark:bg-yellow-800/50 dark:text-yellow-500";
  }

  return "bg-white text-black dark:bg-black dark:text-white";
}

/**
 * Sanitize user input to reduce risk of SQL injection.
 * Note: Always use parameterized queries with your database library.
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/['";\\]/g, '')            // Remove dangerous SQL characters
    .replace(/--/g, '')                 // Remove SQL comment indicators
    .replace(/\b(OR|AND|SELECT|INSERT|DELETE|UPDATE|DROP|UNION)\b/gi, '') // Remove SQL keywords
    .replace(/\s{2,}/g, ' ');           // Collapse multiple spaces
}

export function formatBotMessage(rawMessage: string): string {
  const escaped = rawMessage
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  return escaped
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*/g, '')
    .replace(/\n/g, '<br />');
}


export function getRandomInt1to10() {
  return Math.floor(Math.random() * 10) + 1;
}

export function getBgColorClass(n: number): string {
  if (n < 1 || n > 10) return '';

  const colors: Record<number, string> = {
    1: "bg-red-400 dark:bg-red-500",
    2: "bg-orange-400 dark:bg-red-500",
    3: "bg-fuchsia-500 dark:bg-fuchsia-700",
    4: "bg-yellow-300 dark:bg-yellow-500",
    5: "bg-lime-400 dark:bg-lime-500",
    6: "bg-green-400 dark:bg-green-500",
    7: "bg-emerald-500 dark:bg-emerald-500",
    8: "bg-teal-400 dark:bg-teal-500",
    9: "bg-blue-400 dark:bg-blue-500",
    10: "bg-purple-400 dark:bg-purple-500"
  };

  return colors[n] || '';
}

export function formatDateDDMonYYYY(date: Date, separator: string = '-'): string {
  // Format the date parts
  const day = date.toLocaleDateString('en-GB', { day: '2-digit' });     // e.g. "18"
  const month = date.toLocaleDateString('en-GB', { month: 'short' });   // e.g. "Jun"
  const year = date.toLocaleDateString('en-GB', { year: 'numeric' });   // e.g. "2024"

  // Join them with the custom separator
  return [day, month, year].join(separator);
}




