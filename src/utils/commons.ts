
export const sliceHalfId = (id: string): string => {
  const halfId = id.slice(0, Math.floor(id.length / 2));
  return halfId.trim();
};

export const getFileExtension = (filename: string): string => {
  return filename.substring(filename.lastIndexOf('.'));
};

export const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};


export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

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

export const isEmptyObject = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};

import type { JsonValue } from "../types/common";

export const removeUndefined = <T extends Record<string, JsonValue>>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  ) as Partial<T>;
};

export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
};