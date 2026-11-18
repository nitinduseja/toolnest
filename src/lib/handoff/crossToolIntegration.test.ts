import { describe, it, expect, beforeEach } from 'vitest';
import { setHandoffPayload, getHandoffPayload, clearHandoffPayload } from './crossToolHandoff';
import { parseDelimitedToTable } from '@/tools/markdown-table/tableLogic';
import { autoImportContent } from '@/tools/rest-api-client/collectionImportLogic';
import { parseSqlDdl } from '@/tools/sql-to-schema/sqlSchemaLogic';
import { parseJwt } from '@/tools/jwt-decoder/jwtLogic';

describe('Cross-Tool Interoperability Integration Workflows', () => {
  beforeEach(() => {
    sessionStorage.clear();
    clearHandoffPayload();
  });

  it('Pipeline 1: CSV / Data Pivot (csv-json -> data-chart)', () => {
    const csvData = 'Year,Revenue,Expenses\n2024,100000,60000\n2025,150000,80000';
    setHandoffPayload('csv-json', 'data-chart', {
      data: csvData,
      format: 'csv',
      label: 'Financials',
    });

    const received = getHandoffPayload('data-chart');
    expect(received).not.toBeNull();
    expect(received?.sourceToolSlug).toBe('csv-json');
    expect(received?.data).toBe(csvData);
  });

  it('Pipeline 2: JSON / Types / Schema (json-formatter -> json-to-typescript)', () => {
    const rawJson = '{"id": 42, "name": "Toolnest", "active": true}';
    setHandoffPayload('json-formatter', 'json-to-typescript', {
      data: rawJson,
      format: 'json',
    });

    const received = getHandoffPayload('json-to-typescript');
    expect(received).not.toBeNull();
    expect(received?.data).toBe(rawJson);
    const parsed = JSON.parse(received?.data || '{}');
    expect(parsed.id).toBe(42);
    expect(parsed.name).toBe('Toolnest');
  });

  it('Pipeline 3: cURL -> REST API Client', () => {
    const curlCommand =
      'curl -X POST https://api.toolnest.dev/v1/items -H "Content-Type: application/json" -d \'{"item":"test"}\'';
    setHandoffPayload('curl-converter', 'rest-api-client', {
      data: curlCommand,
      format: 'curl',
    });

    const received = getHandoffPayload('rest-api-client');
    expect(received).not.toBeNull();
    expect(received?.data).toBe(curlCommand);

    const imported = autoImportContent(received?.data || '');
    expect(imported.single).toBeDefined();
    expect(imported.single?.method).toBe('POST');
    expect(imported.single?.url).toBe('https://api.toolnest.dev/v1/items');
  });

  it('Pipeline 4: SVG Patterns / Svg to JSX -> SVG Optimizer', () => {
    const svgCode = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="red"/></svg>';
    setHandoffPayload('svg-patterns', 'svg-optimizer', {
      data: svgCode,
      format: 'svg',
    });

    const received = getHandoffPayload('svg-optimizer');
    expect(received).not.toBeNull();
    expect(received?.data).toContain('<circle');
  });

  it('Pipeline 5: SQL Formatter -> SQL to Schema', () => {
    const sqlDdl =
      'CREATE TABLE users (id INT PRIMARY KEY, email VARCHAR(255) NOT NULL, created_at TIMESTAMP);';
    setHandoffPayload('sql-formatter', 'sql-to-schema', {
      data: sqlDdl,
      format: 'sql',
    });

    const received = getHandoffPayload('sql-to-schema');
    expect(received).not.toBeNull();

    const tables = parseSqlDdl(received?.data || '');
    expect(tables.length).toBe(1);
    expect(tables[0].name.toLowerCase()).toBe('users');
    expect(tables[0].columns.length).toBe(3);
  });

  it('Pipeline 6: JWT Studio <-> JWT Decoder bidirectional handoff', () => {
    const testToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    setHandoffPayload('jwt-studio', 'jwt-decoder', {
      data: testToken,
      format: 'jwt',
    });

    const received = getHandoffPayload('jwt-decoder');
    expect(received).not.toBeNull();
    expect(received?.data).toBe(testToken);

    const parsed = parseJwt(received?.data || '');
    expect(parsed.valid).toBe(true);
    expect(parsed.payload?.name).toBe('John Doe');

    // Handoff back to jwt-studio
    setHandoffPayload('jwt-decoder', 'jwt-studio', {
      data: testToken,
      format: 'jwt',
    });
    const backToStudio = getHandoffPayload('jwt-studio');
    expect(backToStudio?.data).toBe(testToken);
  });

  it('Pipeline 7: Markdown Table -> Markdown Previewer -> Markdown Exporter', () => {
    const markdownTable = '| Col A | Col B |\n| :--- | :--- |\n| Val 1 | Val 2 |';
    setHandoffPayload('markdown-table', 'markdown-previewer', {
      data: markdownTable,
      format: 'markdown',
    });

    const receivedPreview = getHandoffPayload('markdown-previewer');
    expect(receivedPreview?.data).toBe(markdownTable);

    // From previewer to exporter
    setHandoffPayload('markdown-previewer', 'markdown-exporter', {
      data: receivedPreview?.data || '',
      format: 'markdown',
    });

    const receivedExport = getHandoffPayload('markdown-exporter');
    expect(receivedExport?.data).toBe(markdownTable);

    // Can roundtrip back to table parser
    const parsedTable = parseDelimitedToTable(receivedExport?.data || '');
    expect(parsedTable.headers.length).toBe(2);
    expect(parsedTable.rows.length).toBe(1);
  });
});
