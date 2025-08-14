import { z } from 'zod';

// Common validation schemas
export const phoneSchema = z.string()
  .regex(/^[0-9]{10}$/, 'Số điện thoại phải có 10 chữ số');

export const emailSchema = z.string()
  .email('Email không hợp lệ');

export const currencySchema = z.number()
  .min(0, 'Giá trị phải lớn hơn hoặc bằng 0');

export const requiredStringSchema = z.string()
  .min(1, 'Trường này là bắt buộc');

export const optionalStringSchema = z.string().optional();

export const passwordSchema = z.string()
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải có ít nhất 1 chữ thường, 1 chữ hoa và 1 số');

// Validation functions
export function isValidEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

export function isValidPhone(phone: string): boolean {
  return phoneSchema.safeParse(phone).success;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate required fields in an object
 * @param obj - Object to validate
 * @param requiredFields - Array of required field names
 * @returns Array of missing fields
 */
export function validateRequiredFields(
  obj: Record<string, any>,
  requiredFields: string[]
): string[] {
  return requiredFields.filter(field => 
    obj[field] === undefined || 
    obj[field] === null || 
    obj[field] === ''
  );
}