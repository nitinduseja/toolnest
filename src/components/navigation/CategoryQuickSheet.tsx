import React from 'react';
import { Link } from 'react-router-dom';
import { X, Layers, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '@/registry/categories';
import { ALL_TOOLS } from '@/registry/tool-registry';
import { Icon } from '@/components/atoms/Icon';

interface CategoryQuickSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryQuickSheet: React.FC<CategoryQuickSheetProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full sm:max-w-xl max-h-[85vh] sm:rounded-2xl rounded-t-2xl glass-dock bg-surface p-5 sm:p-6 overflow-hidden flex flex-col z-10 border border-outline-variant shadow-2xl animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-container/10 text-primary flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-on-surface">Tool Categories</h2>
              <p className="text-[11px] text-outline">Browse all 36 tools across 12 disciplines</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            aria-label="Close categories sheet"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto py-3 space-y-1.5 flex-1 pr-1">
          {CATEGORIES.map((category) => {
            const count = ALL_TOOLS.filter((t) => t.category === category.id).length;
            return (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                onClick={onClose}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-surface-container transition-colors border border-transparent hover:border-outline-variant/60"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high border border-outline-variant/40 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <Icon name={category.iconName} className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors block">
                      {category.name}
                    </span>
                    <span className="text-[11px] text-outline line-clamp-1">
                      {category.description}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-outline">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-container">
                    {count}
                  </span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-outline group-hover:text-primary" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
