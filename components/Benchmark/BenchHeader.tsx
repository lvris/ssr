import Link from "next/link";
import { useRouter } from "next/router";
import { RenderMode } from "@/lib/bench/types";

const RENDER_MODES: RenderMode[] = ["CSR", "SSR", "SSG", "ISR"];

const MODE_COLORS: Record<RenderMode, string> = {
  CSR: "btn-error",
  SSR: "btn-info",
  SSG: "btn-success",
  ISR: "btn-warning",
};

export default function BenchHeader({
  renderMode,
  buildTime,
}: {
  renderMode: RenderMode;
  buildTime?: string;
}) {
  const router = useRouter();
  const pathParts = router.pathname.split("/");
  const componentName = pathParts[2];
  const getModePath = (mode: RenderMode) =>
    `/bench/${componentName}/${mode.toLowerCase()}`;

  return (
    <div className="flex items-center gap-4 bg-base-200 px-4 py-3">
      <div className="join">
        {RENDER_MODES.map((mode) => (
          <Link
            key={mode}
            href={getModePath(mode)}
            className={`join-item btn btn-sm ${
              mode === renderMode ? MODE_COLORS[mode] : "btn-ghost"
            }`}
          >
            {mode}
          </Link>
        ))}
      </div>
      {buildTime && (
        <span className="opacity-50 ml-auto">
          Built: {new Date(buildTime).toLocaleString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      )}
      {!buildTime && (
        <span className="opacity-50 ml-auto">Live Rendered</span>
      )}
    </div>
  );
}
