import { useState } from "react";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallback?: React.ReactNode;
}

export function SmartImage({ src, fallback, className, alt, ...rest }: Props) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-panel2 text-slate-500 ${className ?? ""}`}
      >
        {fallback ?? (
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 opacity-60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="m3 16 5-5 4 4 3-3 6 6" />
          </svg>
        )}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt ?? ""}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
