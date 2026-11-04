import React, { useState, useMemo, useRef } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { convertCsvToJson, convertJsonToCsv } from './csvLogic';
import { CsvJsonToolbar, ConversionDirection } from './CsvJsonToolbar';
import { copyToClipboard } from '@/lib/clipboard';
import { downloadFile } from '@/lib/downloads';

const SAMPLE_CSV = `id,name,role,department
101,"Linus Torvalds","Fellow","Linux Foundation"
102,"Ada Lovelace","Mathematician","Computing Pioneer"
103,"Grace Hopper","Rear Admiral","US Navy"`;

const SAMPLE_JSON = `[
  {
    "id": 101,
    "name": "Linus Torvalds",
    "role": "Fellow",
    "department": "Linux Foundation"
  },
  {
    "id": 102,
    "name": "Ada Lovelace",
    "role": "Mathematician",
    "department": "Computing Pioneer"
  },
  {
    "id": 103,
    "name": "Grace Hopper",
    "role": "Rear Admiral",
    "department": "US Navy"
  }
]`;

export const CsvToJsonTool: React.FC = () => {
  const [direction, setDirection] = useState<ConversionDirection>('csv-to-json');
  const [input, setInput] = useState(SAMPLE_CSV);
  const [delimiter, setDelimiter] = useState<string>(',');
  const [hasHeader, setHasHeader] = useState(true);
  const [skipEmptyLines, setSkipEmptyLines] = useState(true);
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const conversionResult = useMemo(() => {
    if (direction === 'csv-to-json') {
      const res = convertCsvToJson(input, {
        hasHeader,
        skipEmptyLines,
        indent,
        delimiter: delimiter || undefined,
      });
      return {
        output: res.jsonString,
        rowCount: res.rowCount,
        warnings: res.warnings,
        errors: res.errors,
      };
    } else {
      const res = convertJsonToCsv(input, {
        delimiter,
        header: hasHeader,
      });
      return {
        output: res.csvString,
        rowCount: res.rowCount,
        warnings: res.warnings,
        errors: res.errors,
      };
    }
  }, [direction, input, delimiter, hasHeader, skipEmptyLines, indent]);

  const handleSwap = () => {
    if (direction === 'csv-to-json') {
      setDirection('json-to-csv');
      setInput(conversionResult.output || SAMPLE_JSON);
    } else {
      setDirection('csv-to-json');
      setInput(conversionResult.output || SAMPLE_CSV);
    }
  };

  const handleCopy = async () => {
    if (!conversionResult.output) return;
    const ok = await copyToClipboard(conversionResult.output);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!conversionResult.output) return;
    const isJson = direction === 'csv-to-json';
    downloadFile(conversionResult.output, {
      filename: isJson ? 'data.json' : 'data.csv',
      mimeType: isJson ? 'application/json' : 'text/csv',
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      file.text().then((text) => setInput(text));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      file.text().then((text) => setInput(text));
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.tsv,.json,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Direction & Options Toolbar */}
      <CsvJsonToolbar
        direction={direction}
        setDirection={(d) => {
          setDirection(d);
          setInput(d === 'csv-to-json' ? SAMPLE_CSV : SAMPLE_JSON);
        }}
        handleSwap={handleSwap}
        delimiter={delimiter}
        setDelimiter={setDelimiter}
        hasHeader={hasHeader}
        setHasHeader={setHasHeader}
        skipEmptyLines={skipEmptyLines}
        setSkipEmptyLines={setSkipEmptyLines}
        indent={indent}
        setIndent={setIndent}
        onUploadClick={() => fileInputRef.current?.click()}
        onLoadSample={() => setInput(direction === 'csv-to-json' ? SAMPLE_CSV : SAMPLE_JSON)}
        onClear={() => setInput('')}
        handleCopy={handleCopy}
        copied={copied}
        handleDownload={handleDownload}
        hasOutput={Boolean(conversionResult.output)}
      />

      {/* Warnings & Errors */}
      {conversionResult.warnings.map((w, i) => (
        <div
          key={i}
          className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-500"
        >
          <Info className="w-4 h-4 shrink-0" />
          <span>{w}</span>
        </div>
      ))}

      {conversionResult.errors.map((err, i) => (
        <div
          key={i}
          className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400"
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{err}</span>
        </div>
      ))}

      {/* Split Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className={`space-y-2 rounded-xl transition-all ${
            isDragging ? 'ring-2 ring-primary ring-offset-2' : ''
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="flex items-center justify-between text-xs text-outline px-1">
            <span className="font-medium text-on-surface">
              {direction === 'csv-to-json' ? 'CSV Source Input' : 'JSON Source Input'}
              {isDragging && ' — Drop file here'}
            </span>
            <span className="font-mono text-[11px]">{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              direction === 'csv-to-json'
                ? 'Paste CSV or delimited table rows here...'
                : 'Paste JSON array of objects here...'
            }
            className="w-full h-80 sm:h-96 p-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-outline px-1">
            <span className="font-medium text-on-surface">
              {direction === 'csv-to-json' ? 'JSON Objects Output' : 'CSV Delimited Output'}
            </span>
            <span className="font-mono text-[11px]">{conversionResult.rowCount} rows</span>
          </div>
          <textarea
            readOnly
            value={conversionResult.output}
            placeholder="Parsed result will appear here..."
            className="w-full h-80 sm:h-96 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none resize-y"
          />
        </div>
      </div>
    </div>
  );
};

export default CsvToJsonTool;
