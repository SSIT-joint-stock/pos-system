import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'

dayjs.extend(relativeTime)
dayjs.locale('vi')

/**
 * Format currency amount
 * @param amount - Amount to format
 * @param currency - Currency code (default: VND)
 * @param locale - Locale string (default: vi-VN)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency = 'VND',
  locale = 'vi-VN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format number with locale
 * @param number - Number to format
 * @param locale - Locale string (default: vi-VN)
 * @returns Formatted number string
 */
export function formatNumber(
  number: number,
  locale = 'vi-VN'
): string {
  return new Intl.NumberFormat(locale).format(number);
}

/**
 * Format date
 * @param date - Date to format
 * @param format - Date format (default: DD/MM/YYYY)
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  format = 'DD/MM/YYYY'
): string {
  return dayjs(date).format(format);
}

/**
 * Format date and time
 * @param date - Date to format
 * @param format - DateTime format (default: DD/MM/YYYY HH:mm)
 * @returns Formatted datetime string
 */
export function formatDateTime(
  date: string | Date,
  format = 'DD/MM/YYYY HH:mm'
): string {
  return dayjs(date).format(format);
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date): string {
  return dayjs(date).fromNow();
}

/**
 * Format phone number (Vietnamese format)
 * @param phone - Phone number to format
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format Vietnamese phone numbers
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  
  return phone;
}

/**
 * Generate random string
 * @param length - Length of string (default: 8)
 * @returns Random string
 */
export function generateRandomString(length = 8): string {
  return Math.random().toString(36).substring(2, length + 2);
}

/**
 * Slugify text (convert to URL-friendly string)
 * @param text - Text to slugify
 * @returns Slugified string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}