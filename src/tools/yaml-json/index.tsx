import React, { useState, useMemo, useRef } from 'react';
import { Copy, Check, Download, Upload, Trash2, AlertTriangle, ArrowLeftRight, FileCode } from 'lucide-react';
import { convertYamlToJson, convertJsonToYaml } from './yamlLogic';
import { copyToClipboard } from '@/lib/clipboard';
import { downloadFile } from '@/lib/downloads';

type Direction = 'yaml-to-json' | 'json-to-yaml';

const SAMPLE_YAML = `# Kubernetes Deployment Sample
apiVersion: apps/v1
kind: Deployment
metadata:
  name: toolnest-app
  labels:
    app: toolnest
spec:
  replicas: 3
  selector:
    matchLabels:
      app: toolnest
  template:
    metadata:
      labels:
        app: toolnest
    spec:
      containers:
        - name: web
          image: nginx:1.25-alpine
          ports:
            - containerPort: 80
          resources:
            limits:
              memory: 256Mi
              cpu: 500m`;

const SAMPLE_JSON = `{
  "apiVersion": "apps/v1",
  "kind": "Deployment",
  "metadata": {
    "name": "toolnest-app",
    "labels": {
      "app": "toolnest"
    }
  },
  "spec": {
    "replicas": 3,
    "selector": {
      "matchLabels": {
        "app": "toolnest"
      }
    },
    "template": {
      "metadata": {
        "labels": {
          "app": "toolnest"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "web",
            "image": "nginx:1.25-alpine",
            "ports": [
              {
                "containerPort": 80
              }
            ],
            "resources": {
              "limits": {
                "memory": "256Mi",
                "cpu": "500m"
              }
            }
          }
        ]
      }
    }
  }
}`;

export const YamlJsonTool: React.FC = () => {
  const [direction, setDirection] = useState<Direction>('yaml-to-json');
  const [input, setInput] = useState<string>(SAMPLE_YAML);
  const [indent, setIndent] = useState<number>(2);
  const [copied, setCopied] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const result = useMemo(() => {
    if (direction === 'yaml-to-json') {
      return convertYamlToJson(input, { indent });
    }
    return convertJsonToYaml(input, { indent });
  }, [direction, input, indent]);

  const handleSwap = () => {
    if (direction === 'yaml-to-json') {
      setDirection('json-to-yaml');
      setInput(result.output || SAMPLE_JSON);
    } else {
      setDirection('yaml-to-json');
      setInput(result.output || SAMPLE_YAML);
    }
  };

  const handleCopy = async () => {
    if (!result.output) return;
    const ok = await copyToClipboard(result.output);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!result.output) return;
    const isJson = direction === 'yaml-to-json';
    downloadFile(result.output, {
      filename: isJson ? 'data.json' : 'data.yaml',
      mimeType: isJson ? 'application/json' : 'text/yaml',
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
        accept=".yaml,.yml,.json,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Direction & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-container-high border border-outline-variant/60">
            <button
              type="button"
              onClick={() => {
                if (direction !== 'yaml-to-json') {
                  setDirection('yaml-to-json');
                  setInput(SAMPLE_YAML);
                }
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                direction === 'yaml-to-json'
                  ? 'bg-primary-container text-on-primary-container shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              YAML to JSON
            </button>
            <button
              type="button"
              onClick={() => {
                if (direction !== 'json-to-yaml') {
                  setDirection('json-to-yaml');
                  setInput(SAMPLE_JSON);
                }
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                direction === 'json-to-yaml'
                  ? 'bg-primary-container text-on-primary-container shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              JSON to YAML
            </button>
          </div>

          <button
            type="button"
            onClick={handleSwap}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Swap input and output"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Swap</span>
          </button>

          <div className="h-4 w-px bg-outline-variant" />

          <div className="flex items-center gap-1.5 text-xs text-outline">
            <span>Indent:</span>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="h-8 px-2 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container transition-colors"
            title="Upload File"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload</span>
          </button>
          <button
            type="button"
            onClick={() => setInput(direction === 'yaml-to-json' ? SAMPLE_YAML : SAMPLE_JSON)}
            className="px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Sample
          </button>
          <button
            type="button"
            onClick={() => setInput('')}
            className="p-1.5 rounded-lg text-outline hover:text-red-500 hover:bg-surface-container transition-colors"
            title="Clear Input"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-outline-variant" />
          <button
            type="button"
            onClick={handleCopy}
            disabled={!result.output}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant transition-colors disabled:opacity-40"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!result.output}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40"
            title="Download result"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {result.error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{result.error}</span>
        </div>
      )}

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
              {direction === 'yaml-to-json' ? 'YAML Source Input' : 'JSON Source Input'}
              {isDragging && ' — Drop file here'}
            </span>
            <span className="font-mono text-[11px]">{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              direction === 'yaml-to-json'
                ? 'Paste YAML documents here...'
                : 'Paste JSON objects or arrays here...'
            }
            className="w-full h-80 sm:h-96 p-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-outline px-1">
            <span className="font-medium text-on-surface">
              {direction === 'yaml-to-json' ? 'JSON Output' : 'YAML Output'}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-outline">
              <FileCode className="w-3.5 h-3.5 text-primary" />
              <span>{direction === 'yaml-to-json' ? 'JSON' : 'YAML'}</span>
            </div>
          </div>
          <textarea
            readOnly
            value={result.output}
            placeholder="Converted output will appear here..."
            className="w-full h-80 sm:h-96 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none resize-y"
          />
        </div>
      </div>
    </div>
  );
};

export default YamlJsonTool;

