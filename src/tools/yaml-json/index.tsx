import React, { useState, useMemo, useRef } from 'react';
import { AlertTriangle, FileCode } from 'lucide-react';
import { convertYamlToJson, convertJsonToYaml } from './yamlLogic';
import { YamlJsonToolbar, YamlJsonDirection } from './YamlJsonToolbar';
import { copyToClipboard } from '@/lib/clipboard';
import { downloadFile } from '@/lib/downloads';

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
  const [direction, setDirection] = useState<YamlJsonDirection>('yaml-to-json');
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
      <YamlJsonToolbar
        direction={direction}
        setDirection={(d) => {
          setDirection(d);
          setInput(d === 'yaml-to-json' ? SAMPLE_YAML : SAMPLE_JSON);
        }}
        handleSwap={handleSwap}
        indent={indent}
        setIndent={setIndent}
        onUploadClick={() => fileInputRef.current?.click()}
        onLoadSample={() => setInput(direction === 'yaml-to-json' ? SAMPLE_YAML : SAMPLE_JSON)}
        onClear={() => setInput('')}
        handleCopy={handleCopy}
        copied={copied}
        handleDownload={handleDownload}
        hasOutput={Boolean(result.output)}
      />

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
