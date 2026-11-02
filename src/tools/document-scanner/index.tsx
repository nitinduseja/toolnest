import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScannedPageItem, SavedScanDocument, saveDocument } from './scannerDb';
import { ScanFilterType, filterImageDataUrl } from './filterLogic';
import { PageEditorCanvas } from './PageEditorCanvas';
import { PageThumbnailsStrip } from './PageThumbnailsStrip';
import { ScannerHeader } from './ScannerHeader';
import { CameraScannerModal } from './CameraScannerModal';
import { CornerCropModal } from './CornerCropModal';
import { SignaturePadModal } from './SignaturePadModal';
import { ScanHistoryModal } from './ScanHistoryModal';
import { ExportPdfModal } from './ExportPdfModal';

function createSamplePageCanvas(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 600, 800);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('CONFIDENTIAL SERVICE CONTRACT', 40, 70);
  ctx.font = '13px sans-serif';
  ctx.fillStyle = '#334155';
  ctx.fillText('Agreement ID: DOC-2026-9843 | Date: Nov 2, 2026', 40, 110);
  ctx.fillRect(40, 130, 520, 2);

  ctx.font = '12px monospace';
  ctx.fillStyle = '#475569';
  const lines = [
    '1. SCOPE OF SERVICES: Real-time client-side document processing,',
    'automatic 4-point perspective correction, and multi-page management.',
    '',
    '2. CONFIDENTIALITY: Zero bytes uploaded to external servers.',
  ];
  lines.forEach((line, i) => ctx.fillText(line, 40, 165 + i * 22));
  return canvas.toDataURL('image/jpeg', 0.94);
}

export const DocumentScannerTool: React.FC = () => {
  const [docId, setDocId] = useState<string>(() => `scan_${Date.now()}`);
  const [title, setTitle] = useState<string>('Contract Agreement Scan');
  const [pages, setPages] = useState<ScannedPageItem[]>([]);
  const [activePageId, setActivePageId] = useState<string>('');

  const [isCamOpen, setIsCamOpen] = useState<boolean>(false);
  const [isCropOpen, setIsCropOpen] = useState<boolean>(false);
  const [isSignOpen, setIsSignOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isExportPdfOpen, setIsExportPdfOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const sampleUrl = createSamplePageCanvas();
    const initialPage: ScannedPageItem = {
      id: `page_${Date.now()}`,
      rawCaptureUrl: sampleUrl,
      originalDataUrl: sampleUrl,
      processedDataUrl: sampleUrl,
      rotation: 0,
      filter: 'original',
      brightness: 0,
      contrast: 0,
    };
    setPages([initialPage]);
    setActivePageId(initialPage.id);
  }, []);

  const activePage = pages.find((p) => p.id === activePageId) || pages[0];

  const handleUpdateActivePage = useCallback(
    (updates: Partial<ScannedPageItem>) => {
      setPages((prev) => prev.map((p) => (p.id === activePageId ? { ...p, ...updates } : p)));
    },
    [activePageId]
  );

  const handleApplyFilterToAll = async (newFilter: ScanFilterType) => {
    const updated = await Promise.all(
      pages.map(async (p) => {
        const processed = await filterImageDataUrl(p.originalDataUrl, newFilter, {
          brightness: p.brightness,
          contrast: p.contrast,
        });
        return { ...p, filter: newFilter, processedDataUrl: processed };
      })
    );
    setPages(updated);
  };

  const handleSaveToIndexedDb = async () => {
    if (pages.length === 0) return;
    setIsSaving(true);
    try {
      const doc: SavedScanDocument = {
        id: docId,
        title: title.trim() || 'Untitled Document',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        pages,
      };
      await saveDocument(doc);
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  const handleAddPhotos = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const newPage: ScannedPageItem = {
          id: `page_${Date.now()}_${Math.random()}`,
          rawCaptureUrl: dataUrl,
          originalDataUrl: dataUrl,
          processedDataUrl: dataUrl,
          rotation: 0,
          filter: 'original',
          brightness: 0,
          contrast: 0,
        };
        setPages((prev) => [...prev, newPage]);
        setActivePageId(newPage.id);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleExportImage = () => {
    if (!activePage) return;
    const a = document.createElement('a');
    a.href = activePage.processedDataUrl || activePage.originalDataUrl;
    a.download = `${title.replace(/\s+/g, '_')}_page.jpg`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <ScannerHeader
        title={title}
        onTitleChange={setTitle}
        isSaving={isSaving}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onSave={handleSaveToIndexedDb}
        onOpenCam={() => setIsCamOpen(true)}
        onUploadClick={() => fileInputRef.current?.click()}
        onExportJpg={handleExportImage}
        onExportPdf={() => setIsExportPdfOpen(true)}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.jpg,.jpeg,.png,.webp,.bmp"
        multiple
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          handleAddPhotos(e.target.files);
          e.target.value = '';
        }}
        className="hidden"
      />

      {activePage && (
        <PageEditorCanvas
          page={activePage}
          onUpdatePage={handleUpdateActivePage}
          onOpenCrop={() => setIsCropOpen(true)}
          onOpenSign={() => setIsSignOpen(true)}
          onApplyFilterToAll={handleApplyFilterToAll}
        />
      )}

      {pages.length > 0 && (
        <PageThumbnailsStrip
          pages={pages}
          activeId={activePageId}
          onSelect={setActivePageId}
          onReorder={setPages}
          onDuplicate={(id) => {
            const src = pages.find((p) => p.id === id);
            if (!src) return;
            const copy: ScannedPageItem = { ...src, id: `page_${Date.now()}_${Math.random()}` };
            setPages((prev) => [...prev, copy]);
          }}
          onDelete={(id) => {
            setPages((prev) => prev.filter((p) => p.id !== id));
            if (activePageId === id && pages.length > 1) {
              const remaining = pages.filter((p) => p.id !== id);
              setActivePageId(remaining[0].id);
            }
          }}
          onOpenCam={() => setIsCamOpen(true)}
          onUploadClick={() => fileInputRef.current?.click()}
        />
      )}

      <CameraScannerModal
        isOpen={isCamOpen}
        onClose={() => setIsCamOpen(false)}
        onCapture={(dataUrl) => {
          const newPage: ScannedPageItem = {
            id: `page_${Date.now()}`,
            rawCaptureUrl: dataUrl,
            originalDataUrl: dataUrl,
            processedDataUrl: dataUrl,
            rotation: 0,
            filter: 'original',
            brightness: 0,
            contrast: 0,
          };
          setPages((prev) => [...prev, newPage]);
          setActivePageId(newPage.id);
        }}
      />

      {activePage && (
        <CornerCropModal
          isOpen={isCropOpen}
          imageSrc={activePage.rawCaptureUrl || activePage.originalDataUrl}
          onClose={() => setIsCropOpen(false)}
          onApply={async (croppedUrl) => {
            const filtered = await filterImageDataUrl(croppedUrl, activePage.filter, {
              brightness: activePage.brightness,
              contrast: activePage.contrast,
            });
            handleUpdateActivePage({
              originalDataUrl: croppedUrl,
              processedDataUrl: filtered,
            });
          }}
        />
      )}

      <SignaturePadModal
        isOpen={isSignOpen}
        onClose={() => setIsSignOpen(false)}
        onSave={(sigUrl) => {
          handleUpdateActivePage({
            signatureDataUrl: sigUrl,
            signatureStamp: {
              dataUrl: sigUrl,
              xPercent: 60,
              yPercent: 75,
              scale: 1,
            },
          });
        }}
      />

      <ScanHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectDocument={(savedDoc) => {
          setDocId(savedDoc.id);
          setTitle(savedDoc.title);
          setPages(savedDoc.pages);
          if (savedDoc.pages.length > 0) {
            setActivePageId(savedDoc.pages[0].id);
          }
        }}
      />

      <ExportPdfModal
        isOpen={isExportPdfOpen}
        pages={pages}
        defaultTitle={title}
        onClose={() => setIsExportPdfOpen(false)}
      />
    </div>
  );
};

export default DocumentScannerTool;
