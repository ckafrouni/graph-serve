import { env } from '@/env';
import { Button } from '@workspace/ui/components/ui/button';
import type { Document } from '@workspace/workflows-ui/lib/ai-message';

export function SourcesBlocks({ sourceDocuments }: { sourceDocuments: Document[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {sourceDocuments.map((doc, docIndex) => (
        <Button variant={'outline'} key={docIndex} className="" asChild>
          <a
            href={`${env.VITE_SERVER_URL}/api/files/content/${encodeURIComponent(doc.metadata?.source ?? '')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {docIndex + 1}
          </a>
        </Button>
      ))}
    </div>
  );
}
