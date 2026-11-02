import React, { useState, useEffect, useCallback } from 'react';
import {
  ApiRequest,
  ApiResponse,
  HistoryItem,
  KeyValueItem,
  HttpMethod,
  Environment,
} from './types';
import { executeApiRequest } from './requestExecutorLogic';
import { resolveRequestEnvironment } from './environmentLogic';
import { evaluateAssertions } from './assertionLogic';
import {
  saveHistoryItem,
  getHistoryItems,
  clearHistory,
  getCollectionItems,
  saveEnvironments,
  getEnvironments,
} from './apiStorage';
import { useCollectionsManager } from './useCollectionsManager';
import { RequestUrlBar } from './RequestUrlBar';
import { QueryParamsEditor } from './QueryParamsEditor';
import { HeadersEditor } from './HeadersEditor';
import { AuthEditor } from './AuthEditor';
import { BodyEditor } from './BodyEditor';
import { AssertionsEditor } from './AssertionsEditor';
import { ResponseViewer } from './ResponseViewer';
import { HistoryDrawer } from './HistoryDrawer';
import { ImportModal } from './ImportModal';
import { CodeSnippetModal } from './CodeSnippetModal';
import { WebhookSignerModal } from './WebhookSignerModal';
import { EnvironmentModal } from './EnvironmentModal';
import { CollectionRunnerModal } from './CollectionRunnerModal';

const DEFAULT_REQUEST: ApiRequest = {
  id: 'req_init',
  method: 'GET',
  url: 'https://jsonplaceholder.typicode.com/posts/1',
  params: [],
  headers: [{ id: 'h_1', key: 'Accept', value: 'application/json', enabled: true }],
  auth: { type: 'none' },
  bodyType: 'none',
  bodyContent: '',
  formParams: [],
  assertions: [{ id: 'a_1', type: 'status-200', enabled: true }],
};

export const RestApiClientTool: React.FC = () => {
  const [request, setRequest] = useState<ApiRequest>(DEFAULT_REQUEST);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'auth' | 'body' | 'tests'>(
    'params'
  );

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [activeEnvId, setActiveEnvId] = useState<string>('');

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [isCodeSnippetOpen, setIsCodeSnippetOpen] = useState<boolean>(false);
  const [isWebhookSignerOpen, setIsWebhookSignerOpen] = useState<boolean>(false);
  const [isEnvModalOpen, setIsEnvModalOpen] = useState<boolean>(false);

  const {
    collections,
    setCollections,
    runnerState,
    saveToCollection,
    deleteRequest,
    deleteCollection,
    renameCollection,
    duplicateRequest,
    exportCollection,
    exportAll,
    importCollection,
    openRunner,
    closeRunner,
  } = useCollectionsManager(request);

  const loadSavedData = useCallback(async () => {
    const [hist, coll, envs] = await Promise.all([
      getHistoryItems(),
      getCollectionItems(),
      getEnvironments(),
    ]);
    setHistory(hist);
    setCollections(coll);
    setEnvironments(envs);
  }, [setCollections]);

  useEffect(() => {
    loadSavedData();
  }, [loadSavedData]);

  const activeEnv = environments.find((e) => e.id === activeEnvId) || null;

  const handleSend = async () => {
    if (!request.url.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const resolvedReq = resolveRequestEnvironment(request, activeEnv);
      const res = await executeApiRequest(resolvedReq);
      if (request.assertions && request.assertions.length > 0) {
        res.assertionResults = evaluateAssertions(request.assertions, res);
      }
      setResponse(res);

      const histItem: HistoryItem = {
        id: `hist_${Date.now()}_${Math.random()}`,
        timestamp: Date.now(),
        request: { ...request },
        responseSummary: { status: res.status, timeMs: res.timeMs, error: res.error },
      };
      await saveHistoryItem(histItem);
      setHistory((prev) => [histItem, ...prev.slice(0, 49)]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <RequestUrlBar
        method={request.method}
        url={request.url}
        isLoading={isLoading}
        environments={environments}
        activeEnvId={activeEnvId}
        onMethodChange={(m: HttpMethod) => setRequest((r) => ({ ...r, method: m }))}
        onUrlChange={(u: string) => setRequest((r) => ({ ...r, url: u }))}
        onSend={handleSend}
        onOpenCodeSnippet={() => setIsCodeSnippetOpen(true)}
        onOpenWebhookSigner={() => setIsWebhookSignerOpen(true)}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onSelectSample={(sampleReq: ApiRequest) => {
          setRequest({ ...sampleReq, id: `req_${Date.now()}` });
          setResponse(null);
        }}
        onSelectEnv={setActiveEnvId}
        onOpenEnvModal={() => setIsEnvModalOpen(true)}
      />

      {/* Tabs */}
      <div className="rounded-2xl bg-surface-container-low border border-outline-variant p-4 space-y-4">
        <div className="flex items-center gap-2 border-b border-outline-variant pb-2 text-xs flex-wrap">
          {(
            [
              {
                id: 'params',
                label: `Params (${request.params.filter((p) => p.enabled && p.key).length})`,
              },
              {
                id: 'headers',
                label: `Headers (${request.headers.filter((h) => h.enabled && h.key).length})`,
              },
              { id: 'auth', label: `Auth (${request.auth.type})` },
              { id: 'body', label: `Body (${request.bodyType})` },
              {
                id: 'tests',
                label: `Tests (${request.assertions?.filter((a) => a.enabled).length || 0})`,
              },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`font-semibold pb-1 border-b-2 transition-colors cursor-pointer ${
                activeTab === t.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-outline hover:text-on-surface'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'params' && (
          <QueryParamsEditor
            params={request.params}
            onChange={(params: KeyValueItem[]) => setRequest((r) => ({ ...r, params }))}
          />
        )}
        {activeTab === 'headers' && (
          <HeadersEditor
            headers={request.headers}
            onChange={(headers: KeyValueItem[]) => setRequest((r) => ({ ...r, headers }))}
          />
        )}
        {activeTab === 'auth' && (
          <AuthEditor
            auth={request.auth}
            onChange={(auth) => setRequest((r) => ({ ...r, auth }))}
          />
        )}
        {activeTab === 'body' && (
          <BodyEditor
            bodyType={request.bodyType}
            bodyContent={request.bodyContent}
            formParams={request.formParams}
            onBodyTypeChange={(bodyType) => setRequest((r) => ({ ...r, bodyType }))}
            onBodyContentChange={(bodyContent) => setRequest((r) => ({ ...r, bodyContent }))}
            onFormParamsChange={(formParams) => setRequest((r) => ({ ...r, formParams }))}
          />
        )}
        {activeTab === 'tests' && (
          <AssertionsEditor
            assertions={request.assertions || []}
            onChange={(assertions) => setRequest((r) => ({ ...r, assertions }))}
          />
        )}
      </div>

      <ResponseViewer response={response} isLoading={isLoading} />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        history={history}
        collections={collections}
        currentRequest={request}
        onClose={() => setIsHistoryOpen(false)}
        onSelectRequest={(req) => setRequest(req)}
        onClearHistory={async () => {
          await clearHistory();
          setHistory([]);
        }}
        onSaveToCollection={saveToCollection}
        onDeleteFromCollection={deleteRequest}
        onDeleteCollection={deleteCollection}
        onRenameCollection={renameCollection}
        onDuplicateRequest={duplicateRequest}
        onRunCollection={openRunner}
        onExportCollection={exportCollection}
        onExportAll={exportAll}
      />

      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportSingle={(parsed) => setRequest((r) => ({ ...r, ...parsed }))}
        onImportCollection={async (reqs) => {
          await importCollection(reqs);
          if (reqs.length > 0) setRequest(reqs[0]);
        }}
      />

      <CodeSnippetModal
        isOpen={isCodeSnippetOpen}
        request={request}
        onClose={() => setIsCodeSnippetOpen(false)}
      />

      <WebhookSignerModal
        isOpen={isWebhookSignerOpen}
        payload={request.bodyContent}
        headers={request.headers}
        onClose={() => setIsWebhookSignerOpen(false)}
        onApplyHeader={(headers) => setRequest((r) => ({ ...r, headers }))}
      />

      <EnvironmentModal
        isOpen={isEnvModalOpen}
        environments={environments}
        onClose={() => setIsEnvModalOpen(false)}
        onSaveEnvironments={async (envs) => {
          await saveEnvironments(envs);
          setEnvironments(envs);
        }}
      />

      <CollectionRunnerModal
        isOpen={runnerState.isOpen}
        collectionName={runnerState.name}
        requests={runnerState.requests}
        environment={activeEnv}
        onClose={closeRunner}
      />
    </div>
  );
};

export default RestApiClientTool;
