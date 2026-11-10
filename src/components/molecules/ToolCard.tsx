import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, X, Columns2 } from 'lucide-react';
import { ToolDefinition } from '@/registry/types';
import { Icon } from '@/components/atoms/Icon';
import { useFavorites } from '@/features/favorites/useFavorites';

interface ToolCardProps {
  tool: ToolDefinition;
  onRemove?: () => void;
  removeLabel?: string;
  onOpenInSplit?: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onRemove,
  removeLabel,
  onOpenInSplit,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(tool.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool.id);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove?.();
  };

  const handleNavigateClick = (e: React.MouseEvent) => {
    if ((e.metaKey || e.ctrlKey) && onOpenInSplit) {
      e.preventDefault();
      e.stopPropagation();
      onOpenInSplit();
    }
  };

  return (
    <div className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant hover:border-primary/50 hover:bg-surface-container hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-200">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary/10 to-indigo-500/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 group-hover:border-primary/40 transition-all">
            <Icon name={tool.iconName} className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.isNew && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                New
              </span>
            )}
            {tool.badge && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-surface-container-high text-primary border border-primary/20">
                {tool.badge}
              </span>
            )}
            <button
              type="button"
              onClick={handleFavoriteClick}
              aria-label={
                favorite ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`
              }
              className="p-1.5 rounded-lg text-outline hover:text-amber-500 hover:bg-surface-container-high transition-colors"
            >
              <Star className={`w-4 h-4 ${favorite ? 'fill-amber-400 text-amber-500' : ''}`} />
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={handleRemoveClick}
                aria-label={removeLabel || `Remove ${tool.name}`}
                className="p-1.5 rounded-lg text-outline hover:text-red-500 hover:bg-surface-container-high transition-colors"
                title={removeLabel || 'Remove'}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <Link
          to={`/tools/${tool.slug}`}
          onClick={handleNavigateClick}
          className="focus:outline-none block"
        >
          <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors mb-1.5">
            {tool.name}
          </h3>
          <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
            {tool.description}
          </p>
        </Link>
      </div>

      <div className="mt-4 pt-3 border-t border-outline-variant/60 flex items-center justify-between text-xs text-outline">
        <span className="capitalize text-[11px] font-medium text-outline">
          {tool.category.replace('-', ' ')}
        </span>
        <div className="flex items-center gap-2">
          {onOpenInSplit && (
            <button
              type="button"
              onClick={onOpenInSplit}
              title="Open in split view (⌘+Click)"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-outline hover:text-primary transition-colors cursor-pointer"
            >
              <Columns2 className="w-3 h-3" />
              <span>Split</span>
            </button>
          )}
          <Link
            to={`/tools/${tool.slug}`}
            onClick={handleNavigateClick}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:translate-x-0.5 transition-transform"
          >
            <span>Launch</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
