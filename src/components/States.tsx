export function Loading({ rows = 6 }: { rows?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="card">
          <div className="skeleton h-40 w-full" />
          <div className="p-3 space-y-2">
            <div className="skeleton h-4 w-2/3" />
            <div className="skeleton h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorMsg({ error }: { error: unknown }) {
  const msg = error instanceof Error ? error.message : String(error);
  return (
    <div className="p-6 rounded-lg border border-red-900/40 bg-red-950/30 text-red-200 text-sm">
      Something went wrong: {msg}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-10 rounded-xl border border-dashed border-edge text-center text-slate-400">
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle?: string;
  image?: string;
}) {
  return (
    <div className="relative rounded-2xl overflow-hidden mb-6 border border-edge">
      {image ? (
        <div className="absolute inset-0">
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-panel to-panel2" />
      )}
      <div className="relative p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-slate-300 max-w-3xl">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
