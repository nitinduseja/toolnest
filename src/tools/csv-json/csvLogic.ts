import Papa from 'papaparse';

export interface CsvToJsonOptions {
  hasHeader?: boolean;
  skipEmptyLines?: boolean;
  indent?: number;
  delimiter?: string;
}

export interface CsvConversionResult {
  jsonString: string;
  rowCount: number;
  warnings: string[];
  errors: string[];
}

export interface JsonToCsvOptions {
  delimiter?: string;
  header?: boolean;
  quotes?: boolean;
}

export interface JsonToCsvResult {
  csvString: string;
  rowCount: number;
  warnings: string[];
  errors: string[];
}

export function convertCsvToJson(
  csvContent: string,
  options?: CsvToJsonOptions
): CsvConversionResult {
  const trimmed = csvContent.trim();
  if (!trimmed) {
    return { jsonString: '[]', rowCount: 0, warnings: [], errors: [] };
  }

  const {
    hasHeader = true,
    skipEmptyLines = true,
    indent = 2,
    delimiter = '',
  } = options || {};

  const parseConfig: Papa.ParseConfig = {
    header: false,
    skipEmptyLines,
  };
  if (delimiter) {
    parseConfig.delimiter = delimiter;
  }

  const parsed = Papa.parse(trimmed, parseConfig);

  const errors: string[] = parsed.errors.map((e) => `Row ${e.row}: ${e.message}`);
  const warnings: string[] = [];

  const rawRows = parsed.data as string[][];
  if (rawRows.length === 0) {
    return { jsonString: '[]', rowCount: 0, warnings, errors };
  }

  let finalData: unknown[];

  if (hasHeader) {
    const rawHeaders = rawRows[0];
    const headerCounts = new Map<string, number>();
    const sanitizedHeaders: string[] = [];

    // Deduplicate duplicate column headers deterministically
    rawHeaders.forEach((h, idx) => {
      const colName = (h ?? '').trim() || `column_${idx + 1}`;
      const count = (headerCounts.get(colName) || 0) + 1;
      headerCounts.set(colName, count);

      if (count > 1) {
        warnings.push(`Duplicate column header "${colName}" renamed to "${colName}_${count}".`);
        sanitizedHeaders.push(`${colName}_${count}`);
      } else {
        sanitizedHeaders.push(colName);
      }
    });

    finalData = rawRows.slice(1).map((row) => {
      const obj: Record<string, string> = {};
      sanitizedHeaders.forEach((header, i) => {
        obj[header] = row[i] !== undefined ? row[i] : '';
      });
      return obj;
    });
  } else {
    // Array of arrays
    finalData = rawRows;
  }

  const jsonString = JSON.stringify(finalData, null, indent);
  return {
    jsonString,
    rowCount: finalData.length,
    warnings,
    errors,
  };
}

export function convertJsonToCsv(
  jsonContent: string,
  options?: JsonToCsvOptions
): JsonToCsvResult {
  const trimmed = jsonContent.trim();
  if (!trimmed) {
    return { csvString: '', rowCount: 0, warnings: [], errors: [] };
  }

  const { delimiter = ',', header = true, quotes = false } = options || {};

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch (err) {
    return {
      csvString: '',
      rowCount: 0,
      warnings: [],
      errors: [err instanceof Error ? `JSON syntax error: ${err.message}` : 'Invalid JSON input'],
    };
  }

  if (!Array.isArray(parsed)) {
    if (typeof parsed === 'object' && parsed !== null) {
      parsed = [parsed];
    } else {
      return {
        csvString: '',
        rowCount: 0,
        warnings: [],
        errors: ['Input must be a JSON array of objects or values.'],
      };
    }
  }

  const dataArray = parsed as unknown[];
  if (dataArray.length === 0) {
    return { csvString: '', rowCount: 0, warnings: [], errors: [] };
  }

  try {
    const csvString = Papa.unparse(dataArray, {
      delimiter,
      header,
      quotes,
    });
    return {
      csvString,
      rowCount: dataArray.length,
      warnings: [],
      errors: [],
    };
  } catch (err) {
    return {
      csvString: '',
      rowCount: 0,
      warnings: [],
      errors: [err instanceof Error ? err.message : 'Failed to unparse JSON into CSV.'],
    };
  }
}
