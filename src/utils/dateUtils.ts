/**
 * Date utility functions for handling date validations and conversions
 */

/**
 * Convert string date to Date object at start of day (00:00:00)
 * @param dateString - Date string in any valid format (YYYY-MM-DD, ISO-8601, etc.)
 * @returns Date object at midnight
 */
export function toStartOfDay(dateString: string | Date): Date {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Get current date at start of day (00:00:00)
 * @returns Today's date at midnight
 */
export function getTodayStartOfDay(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Check if a date is in the future (compared to today)
 * @param date - Date to check
 * @returns true if date is after today
 */
export function isDateInFuture(date: Date | string): boolean {
  const dateToCheck = toStartOfDay(date);
  const today = getTodayStartOfDay();
  return dateToCheck > today;
}

/**
 * Check if date1 is before date2
 * @param date1 - First date
 * @param date2 - Second date
 * @returns true if date1 is before date2
 */
export function isDateBefore(date1: Date | string, date2: Date | string): boolean {
  const d1 = toStartOfDay(date1);
  const d2 = toStartOfDay(date2);
  return d1 < d2;
}

/**
 * Check if date1 is after date2
 * @param date2 - First date
 * @param date1 - Second date
 * @returns true if date1 is after date2
 */
export function isDateAfter(date1: Date | string, date2: Date | string): boolean {
  const d1 = toStartOfDay(date1);
  const d2 = toStartOfDay(date2);
  return d1 > d2;
}

/**
 * Check if date1 is before or equal to date2
 * @param date1 - First date
 * @param date2 - Second date
 * @returns true if date1 <= date2
 */
export function isDateBeforeOrEqual(date1: Date | string, date2: Date | string): boolean {
  const d1 = toStartOfDay(date1);
  const d2 = toStartOfDay(date2);
  return d1 <= d2;
}

/**
 * Validate issue date and expire date for qualifications
 * @param issueDate - Issue date
 * @param expireDate - Expire date (optional)
 * @throws Error if validation fails
 */
export function validateQualificationDates(
  issueDate: string | Date,
  expireDate?: string | Date | null
): void {
  const issue = toStartOfDay(issueDate);

  // Check if issue date is in the future
  if (isDateInFuture(issue)) {
    throw new Error('Issue date cannot be in the future');
  }

  // Validate expire date if provided
  if (expireDate) {
    const expire = toStartOfDay(expireDate);
    
    if (isDateBeforeOrEqual(expire, issue)) {
      throw new Error('Expire date must be after issue date');
    }
  }
}

/**
 * Convert string date to Date object or return undefined if null/empty
 * @param dateString - Date string or null/undefined
 * @returns Date object or undefined
 */
export function toDateOrUndefined(dateString?: string | null): Date | undefined {
  if (!dateString) {
    return undefined;
  }
  return new Date(dateString);
}

/**
 * Check if a qualification has expired
 * @param expireDate - Expire date to check
 * @returns true if expired (expire date is in the past)
 */
export function isQualificationExpired(expireDate: Date | string | null): boolean {
  if (!expireDate) {
    return false; // No expire date means never expires
  }
  
  const expire = toStartOfDay(expireDate);
  const today = getTodayStartOfDay();
  return expire < today;
}

/**
 * Format date to ISO string for Prisma (YYYY-MM-DDTHH:mm:ss.sssZ)
 * @param date - Date to format
 * @returns ISO string
 */
export function toISOString(date: Date | string): string {
  return new Date(date).toISOString();
}
