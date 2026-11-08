import React, { useState, useMemo } from 'react';
import { Layers, FileCode, AlertTriangle, RotateCcw } from 'lucide-react';
import { OpenApiEndpoint, OpenApiPreset } from './types';
import { parseOpenApiSpec, OPENAPI_PRESETS } from './openapiLogic';
import { OpenApiPresetsBar } from './OpenApiPresetsBar';
import { OpenApiEndpointsList } from './OpenApiEndpointsList';
import { OpenApiEndpointDrawer } from './OpenApiEndpointDrawer';

export const OpenApiInspectorTool: React.FC = () => {
  const [specText, setSpecText] = useState<string>(OPENAPI_PRESETS[0].spec);
  const [activePresetId, setActivePresetId] = useState<string | undefined>('petstore');
  const [selectedEndpointId, setSelectedEndpointId] = useState<string | undefined>('GET-/pets');
  const [viewTab, setViewTab] = useState<'inspector' | 'raw'>('inspector');

  const parsedDoc = useMemo(() => parseOpenApiSpec(specText), [specText]);

  const selectedEndpoint = useMemo(() => {
    return parsedDoc.endpoints.find((e) => e.id === selectedEndpointId) || parsedDoc.endpoints[0];
  }, [parsedDoc, selectedEndpointId]);

  const handleSelectPreset = (preset: OpenApiPreset) => {
    setActivePresetId(preset.id);
    setSpecText(preset.spec);
    const doc = parseOpenApiSpec(preset.spec);
    if (doc.endpoints.length > 0) {
      setSelectedEndpointId(doc.endpoints[0].id);
    }
  };

  const handleSelectEndpoint = (ep: OpenApiEndpoint) => {
    setSelectedEndpointId(ep.id);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">
              OpenAPI / Swagger Spec Inspector
            </h2>
            <p className="text-xs text-outline mt-0.5">
              Inspect OpenAPI 3.0 & Swagger endpoints, browse parameters, and generate mock
              payloads.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab View Toggle */}
          <div className="p-1 rounded-xl bg-surface-container border border-outline-variant/60 flex gap-1">
            <button
              type="button"
              onClick={() => setViewTab('inspector')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewTab === 'inspector'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              Endpoints ({parsedDoc.endpoints.length})
            </button>
            <button
              type="button"
              onClick={() => setViewTab('raw')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewTab === 'raw'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Spec YAML</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleSelectPreset(OPENAPI_PRESETS[0])}
            className="p-2 text-xs text-outline hover:text-on-surface rounded-xl border border-outline-variant hover:bg-surface-container transition-colors"
            title="Reset to default preset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Presets Bar */}
      <OpenApiPresetsBar onSelectPreset={handleSelectPreset} activeId={activePresetId} />

      {/* Syntax Error Warning Banner */}
      {parsedDoc.error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-500 text-xs">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <strong className="font-bold">Invalid Spec Syntax: </strong>
            <span>{parsedDoc.error}</span>
          </div>
        </div>
      )}

      {/* View: Raw Spec Textarea */}
      {viewTab === 'raw' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-3">
          <label
            htmlFor="raw-openapi-spec"
            className="text-xs font-bold text-on-surface uppercase tracking-wider"
          >
            Raw OpenAPI 3.0 Spec (YAML or JSON)
          </label>
          <textarea
            id="raw-openapi-spec"
            rows={16}
            value={specText}
            onChange={(e) => {
              setActivePresetId(undefined);
              setSpecText(e.target.value);
            }}
            placeholder="Paste your OpenAPI YAML or JSON specification here..."
            className="w-full p-4 text-xs font-mono rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/40 leading-relaxed resize-y"
          />
        </div>
      )}

      {/* View: Endpoints Inspector Split Grid */}
      {viewTab === 'inspector' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Endpoints List: 5 cols */}
          <div className="lg:col-span-5">
            <OpenApiEndpointsList
              endpoints={parsedDoc.endpoints}
              selectedId={selectedEndpoint?.id}
              onSelect={handleSelectEndpoint}
            />
          </div>

          {/* Endpoint Details Drawer: 7 cols */}
          <div className="lg:col-span-7">
            {selectedEndpoint ? (
              <OpenApiEndpointDrawer endpoint={selectedEndpoint} />
            ) : (
              <div className="p-12 text-center text-xs text-outline bg-surface-container-low border border-outline-variant/60 rounded-2xl">
                No endpoint selected.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenApiInspectorTool;
