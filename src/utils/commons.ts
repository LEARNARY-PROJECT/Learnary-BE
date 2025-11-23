/**
 * Cắt một nửa đầu của user ID
 * @param user_id - User ID đầy đủ
 * @returns Nửa đầu của user ID
 */
export const sliceHalfUserId = (user_id: string): string => {
  const halfUserId = user_id.slice(0, Math.floor(user_id.length / 2));
  return halfUserId;
};

/**
 * Lấy file extension từ filename
 * @param filename - Tên file (ví dụ: "photo.jpg")
 * @returns Extension (ví dụ: ".jpg")
 */
export const getFileExtension = (filename: string): string => {
  return filename.substring(filename.lastIndexOf('.'));
};

/**
 * Generate random string
 * @param length - Độ dài string cần tạo
 * @returns Random string
 */
export const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Format date to YYYY-MM-DD
 * @param date - Date object
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Validate email format
 * @param email - Email string
 * @returns true nếu email hợp lệ
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize filename (xóa ký tự đặc biệt)
 * @param filename - Tên file gốc
 * @returns Tên file đã được sanitize
 */
export const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};

/**
 * Sleep/delay function
 * @param ms - Milliseconds to sleep
 * @returns Promise
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Truncate string
 * @param str - String cần cắt
 * @param maxLength - Độ dài tối đa
 * @returns String đã cắt + "..."
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

/**
 * Generate slug from string
 * @param str - String gốc
 * @returns Slug (ví dụ: "Hello World" → "hello-world")
 */
export const generateSlug = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')     // Remove special chars
    .trim()
    .replace(/\s+/g, '-')             // Replace spaces with -
    .replace(/-+/g, '-');             // Remove duplicate -
};

/**
 * Check if object is empty
 * @param obj - Object cần check
 * @returns true nếu object rỗng
 */
export const isEmptyObject = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * Remove undefined values from object
 * @param obj - Object gốc
 * @returns Object mới không có undefined
 */
import type { JsonValue } from "../types/common";

export const removeUndefined = <T extends Record<string, JsonValue>>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  ) as Partial<T>;
};

/**
 * Parse JSON safely
 * @param jsonString - JSON string
 * @param fallback - Giá trị mặc định nếu parse lỗi
 * @returns Parsed object hoặc fallback
 */
export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
};