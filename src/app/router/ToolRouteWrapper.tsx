import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { TOOL_SLUG_MAP } from '@/registry/tool-registry';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const ToolRouteWrapper: React.FC = () => {
  const { toolSlug } = useParams<{ toolSlug: string }>();
  const tool = toolSlug ? TOOL_SLUG_MAP.get(toolSlug) : undefined;

  if (!tool) {
    return <NotFoundPage />;
  }

  const Component = tool.component;

  return (
    <ToolLayout tool={tool}>
      <Suspense
        fallback={
          <div className="w-full min-h-[300px] flex items-center justify-center text-outline">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono">Loading {tool.name}...</span>
            </div>
          </div>
        }
      >
        <Component />
      </Suspense>
    </ToolLayout>
  );
};
