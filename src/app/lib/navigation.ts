/**
 * Navigation utilities for handling base path consistently
 */

// Use the environment variable for base path, or empty string if not set
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/**
 * Creates a URL with the base path properly included
 * @param path The path without the base path
 * @returns The full path with base path included
 */
export function createPath(path: string): string {
  // If BASE_PATH is empty, just return the path
  if (!BASE_PATH) {
    return path.startsWith('/') ? path : `/${path}`;
  }
  
  // If path already starts with the base path or is an external URL, return it as is
  if (path.startsWith(BASE_PATH) || path.startsWith('http') || path.startsWith('#')) {
    return path;
  }
  
  // Ensure path starts with '/' for proper joining
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalizedPath}`;
} 