import Link from 'next/link';
import { useRouter } from 'next/router';
import { RenderMode } from '@/lib/bench/types';

const RENDER_MODES: RenderMode[] = ['CSR', 'SSR', 'SSG', 'ISR'];

const MODE_COLORS: Record<RenderMode, string> = {
  CSR: 'btn-error',
  SSR: 'btn-info',
  SSG: 'btn-success',
  ISR: 'btn-warning',
};

const MODE_DESC: Record<RenderMode, string> = {
  CSR: 'Client-Side Rendered',
  SSR: 'Server-Side Rendered',
  SSG: 'Static Site Generated',
  ISR: 'Incremental Static Regeneration',
};

export default function BenchHeader({ renderMode, buildTime }: { renderMode: RenderMode; buildTime?: string }) {
  const router = useRouter();
  const pathParts = router.pathname.split('/');
  const componentName = pathParts[2];
  const getModePath = (mode: RenderMode) => `/bench/${componentName}/${mode.toLowerCase()}`;

  return (
    <div className="flex items-center gap-4 bg-base-200 px-4 py-3">
      <div className="join">
        {RENDER_MODES.map((mode) => (
          <Link
            key={mode}
            href={getModePath(mode)}
            className={`join-item btn btn-sm ${
              mode === renderMode ? MODE_COLORS[mode] : 'btn-ghost'
            }`}
          >
            {mode}
          </Link>
        ))}
      </div>
      <span className="opacity-70">{MODE_DESC[renderMode]}</span>
      {buildTime && (
        <span className="opacity-50 ml-auto">
          Built: {new Date(buildTime).toLocaleString()}
        </span>
      )}
    </div>
  );
}