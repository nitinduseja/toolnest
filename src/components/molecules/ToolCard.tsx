import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, X } from 'lucide-react';
import { ToolDefinition } from '@/registry/types';
import { Icon } from '@/components/atoms/Icon';
import { useFavorites } from '@/features/favorites/useFavorites';

interface ToolCardProps {
  tool: ToolDefinition;
  onRemove?: () => void;
  removeLabel?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onRemove, removeLabel }) => {
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

  return (
    <div className="group relative flex flex-col justify-between p-4 rounded-xl bg-surface-container-low border border-outline-variant hover:border-primary-container/80 hover:bg-surface-container transition-all duration-150 shadow-xs hover:shadow-md">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="w-9 h-9 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
            <Icon name={tool.iconName} className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.badge && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-surface-container-high text-on-surface-variant">
                {tool.badge}
              </span>
            )}
            <button
              type="button"
              onClick={handleFavoriteClick}
              aria-label={
                favorite ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`
              }
              className="p-1 rounded-md text-outline hover:text-amber-500 hover:bg-surface-container-high transition-colors"
            >
              <Star className={`w-4 h-4 ${favorite ? 'fill-amber-400 text-amber-500' : ''}`} />
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={handleRemoveClick}
                aria-label={removeLabel || `Remove ${tool.name}`}
                className="p-1 rounded-md text-outline hover:text-red-500 hover:bg-surface-container-high transition-colors"
                title={removeLabel || 'Remove'}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <Link to={`/tools/${tool.slug}`} className="focus:outline-none">
          <h3 className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors mb-1">
            {tool.name}
          </h3>
          <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
            {tool.description}
          </p>
        </Link>
      </div>

      <div className="mt-4 pt-3 border-t border-outline-variant/60 flex items-center justify-between text-xs text-outline">
        <span className="capitalize text-[11px] font-medium">
          {tool.category.replace('-', ' ')}
        </span>
        <Link
          to={`/tools/${tool.slug}`}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
        >
          <span>Open</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
