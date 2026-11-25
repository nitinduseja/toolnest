import React, { useState } from 'react';
import { GripHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { ToolDefinition } from '@/registry/types';
import { ToolCard } from '@/components/molecules/ToolCard';

interface DraggableFavoriteGridProps {
  tools: ToolDefinition[];
  onReorder: (sourceId: string, targetId: string) => void;
  onMoveStep: (toolId: string, direction: 'up' | 'down') => void;
  columnsClassName?: string;
}

export const DraggableFavoriteGrid: React.FC<DraggableFavoriteGridProps> = ({
  tools,
  onReorder,
  onMoveStep,
  columnsClassName = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
}) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  return (
    <div className={columnsClassName}>
      {tools.map((tool, index) => {
        const isDragged = draggedId === tool.id;
        const isOver = dragOverId === tool.id && draggedId !== tool.id;

        return (
          <div
            key={tool.id}
            draggable
            data-favorite-id={tool.id}
            onDragStart={(e) => {
              setDraggedId(tool.id);
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', tool.id);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              if (dragOverId !== tool.id) setDragOverId(tool.id);
            }}
            onDragLeave={() => {
              if (dragOverId === tool.id) setDragOverId(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              const source = draggedId || e.dataTransfer.getData('text/plain');
              if (source && source !== tool.id) {
                onReorder(source, tool.id);
              }
              setDraggedId(null);
              setDragOverId(null);
            }}
            onDragEnd={() => {
              setDraggedId(null);
              setDragOverId(null);
            }}
            className={`relative rounded-2xl transition-all ${
              isDragged ? 'opacity-50 scale-[0.98]' : ''
            } ${isOver ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : ''}`}
          >
            {/* Subtle Reorder Handle Bar */}
            <div className="flex items-center justify-between px-3 py-1 mb-1 rounded-xl bg-surface-container/70 border border-outline-variant/60 text-[11px] text-outline">
              <div
                className="flex items-center gap-1.5 cursor-grab active:cursor-grabbing select-none"
                title="Drag card to reorder"
              >
                <GripHorizontal className="w-3.5 h-3.5 text-primary" />
                <span className="font-mono">#{index + 1}</span>
              </div>

              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => onMoveStep(tool.id, 'up')}
                  aria-label={`Move ${tool.name} earlier`}
                  className="p-0.5 rounded hover:bg-surface-container-high hover:text-on-surface disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === tools.length - 1}
                  onClick={() => onMoveStep(tool.id, 'down')}
                  aria-label={`Move ${tool.name} later`}
                  className="p-0.5 rounded hover:bg-surface-container-high hover:text-on-surface disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <ToolCard tool={tool} />
          </div>
        );
      })}
    </div>
  );
};
