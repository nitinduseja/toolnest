import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '@/registry/categories';
import { ALL_TOOLS } from '@/registry/tool-registry';
import { Icon } from '@/components/atoms/Icon';

export const CategoryMatrixSection: React.FC = () => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture & Disciplines</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
            Browse by Domain
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => {
          const count = ALL_TOOLS.filter((t) => t.category === cat.id).length;
          return (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="group p-4 rounded-2xl glass-card hover:border-primary/50 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-outline-variant/60 flex items-center justify-center text-primary group-hover:scale-105 group-hover:border-primary/40 transition-all">
                    <Icon name={cat.iconName} className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-container text-outline">
                    {count} tools
                  </span>
                </div>

                <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs text-outline group-hover:text-primary transition-colors">
                <span className="text-[11px] font-medium">Explore Domain</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
