/**
 * Pure domain logic for HTTP status code and header lookup and filtering.
 */
import { STATUS_CODES, HttpStatusCode, StatusCategory } from './statusCodesData';
import { HTTP_HEADERS, HttpHeaderInfo, HeaderCategory } from './headersData';

export interface CategoryBadgeStyle {
  label: string;
  bg: string;
  text: string;
  border: string;
}

export function filterStatusCodes(
  query: string,
  category: StatusCategory | 'all'
): HttpStatusCode[] {
  const cleanQuery = query.trim().toLowerCase();

  return STATUS_CODES.filter((item) => {
    const matchesCat = category === 'all' || item.category === category;
    if (!matchesCat) return false;
    if (!cleanQuery) return true;

    return (
      item.code.toString().includes(cleanQuery) ||
      item.name.toLowerCase().includes(cleanQuery) ||
      item.summary.toLowerCase().includes(cleanQuery) ||
      item.description.toLowerCase().includes(cleanQuery)
    );
  });
}

export function filterHttpHeaders(
  query: string,
  category: HeaderCategory | 'all'
): HttpHeaderInfo[] {
  const cleanQuery = query.trim().toLowerCase();

  return HTTP_HEADERS.filter((item) => {
    const matchesCat = category === 'all' || item.category === category;
    if (!matchesCat) return false;
    if (!cleanQuery) return true;

    return (
      item.name.toLowerCase().includes(cleanQuery) ||
      item.summary.toLowerCase().includes(cleanQuery) ||
      item.description.toLowerCase().includes(cleanQuery)
    );
  });
}

export function getStatusCategoryBadge(category: StatusCategory): CategoryBadgeStyle {
  switch (category) {
    case '1xx':
      return {
        label: 'Informational',
        bg: 'bg-blue-500/10 dark:bg-blue-500/20',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-500/30',
      };
    case '2xx':
      return {
        label: 'Success',
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-500/30',
      };
    case '3xx':
      return {
        label: 'Redirection',
        bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
        text: 'text-cyan-600 dark:text-cyan-400',
        border: 'border-cyan-500/30',
      };
    case '4xx':
      return {
        label: 'Client Error',
        bg: 'bg-amber-500/10 dark:bg-amber-500/20',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-500/30',
      };
    case '5xx':
      return {
        label: 'Server Error',
        bg: 'bg-rose-500/10 dark:bg-rose-500/20',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-500/30',
      };
  }
}

export function generateCurlSnippet(code: number): string {
  return `curl -i -X GET https://httpbin.org/status/${code}`;
}
