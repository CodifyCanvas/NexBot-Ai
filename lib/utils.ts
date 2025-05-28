import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { marked } from 'marked';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getColorByLetter(name: string) {
  let letter = name.charAt(0).toLowerCase();

  if (/^[a-d]$/.test(letter)) {
    return "bg-green-950 text-green-400";
  } else if (/^[e-h]$/.test(letter)) {
    return "bg-blue-950 text-blue-400";
  } else if (/^[i-m]$/.test(letter)) {
    return "bg-red-950 text-red-400";
  } else if (/^[n-r]$/.test(letter)) {
    return "bg-purple-950 text-purple-400";
  } else if (/^[s-v]$/.test(letter)) {
    return "bg-orange-950 text-orange-400";
  } else if (/^[w-z]$/.test(letter)) {
    return "bg-yellow-950 text-yellow-400";
  }

  return "bg-muted text-foreground"; // Consistently return a string for the default case
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

  const colors = {
    1: "bg-red-500",
    2: "bg-orange-500",
    3: "bg-fuchsia-700",
    4: "bg-yellow-500",
    5: "bg-lime-500",
    6: "bg-green-500",
    7: "bg-emerald-500",
    8: "bg-teal-500",
    9: "bg-blue-500",
    10: "bg-purple-500"
  };

  return colors[n] || '';
}



