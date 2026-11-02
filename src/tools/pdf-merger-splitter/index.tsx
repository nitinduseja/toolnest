import React, { useState } from 'react';
import { FileStack, Scissors, ShieldCheck, Sparkles, RotateCcw } from 'lucide-react';
import { PdfFileItem, getPdfPageCount, createSamplePdf } from './pdfLogic';
import { PdfMergeView } from './PdfMergeView';
import { PdfSplitRotateView } from './PdfSplitRotateView';
import { PdfDropZone } from './PdfDropZone';

type MainTab = 'merge' | 'split';

export const PdfMergerSplitterTool: React.FC = () => {
  const [tab, setTab] = useState<MainTab>('merge');
  const [mergeFiles, setMergeFiles] = useState<PdfFileItem[]>([]);
  const [splitFile, setSplitFile] = useState<PdfFileItem | null>(null);

  const handleAddMergeFiles = async (files: File[]) => {
    const newItems: PdfFileItem[] = [];
    for (const f of files) {
      const arrayBuffer = await f.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const pageCount = await getPdfPageCount(bytes);
      newItems.push({
        id: `pdf_${Date.now()}_${Math.random()}`,
        name: f.name,
        size: f.size,
        pageCount,
        data: bytes,
      });
    }
    setMergeFiles((prev) => [...prev, ...newItems]);
  };

  const handleSelectSplitFile = async (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    const arrayBuffer = await f.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const pageCount = await getPdfPageCount(bytes);
    setSplitFile({
      id: `pdf_${Date.now()}`,
      name: f.name,
      size: f.size,
      pageCount,
      data: bytes,
    });
  };

  const handleLoadSample = async () => {
    const sample1 = await createSamplePdf('Chapter 1 Overview', 3);
    const sample2 = await createSamplePdf('Chapter 2 Details', 2);
    setMergeFiles([
      {
        id: 'sample_1',
        name: 'Sample-Doc-1.pdf',
        size: sample1.length,
        pageCount: 3,
        data: sample1,
      },
      {
        id: 'sample_2',
        name: 'Sample-Doc-2.pdf',
        size: sample2.length,
        pageCount: 2,
        data: sample2,
      },
    ]);
    const multiSample = await createSamplePdf('Multi-Page Sample Document', 6);
    setSplitFile({
      id: 'sample_multi',
      name: 'Sample-Report-6Pages.pdf',
      size: multiSample.length,
      pageCount: 6,
      data: multiSample,
    });
  };

  const handleReset = () => {
    setMergeFiles([]);
    setSplitFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Privacy Notice Ribbon */}
      <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-between flex-wrap gap-2 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            <strong>100% Client-Side PDF Engine:</strong> All page extraction, merging, and rotation
            occur in browser memory. Documents never touch an external server.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSample}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Load Samples</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div className="flex bg-surface-container-low rounded-xl p-1 border border-outline-variant max-w-md">
        <button
          type="button"
          onClick={() => setTab('merge')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            tab === 'merge'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <FileStack className="w-3.5 h-3.5" />
          <span>Merge Documents ({mergeFiles.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('split')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            tab === 'split'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Split / Extract / Rotate</span>
        </button>
      </div>

      {/* Mode Workspace */}
      {tab === 'merge' ? (
        <PdfMergeView
          files={mergeFiles}
          onAddFiles={handleAddMergeFiles}
          onReorder={setMergeFiles}
          onRemove={(id) => setMergeFiles((prev) => prev.filter((f) => f.id !== id))}
        />
      ) : splitFile ? (
        <PdfSplitRotateView file={splitFile} onClear={() => setSplitFile(null)} />
      ) : (
        <PdfDropZone
          onFilesSelected={handleSelectSplitFile}
          multiple={false}
          label="Drop a PDF file to extract or rotate pages"
        />
      )}
    </div>
  );
};

export default PdfMergerSplitterTool;
