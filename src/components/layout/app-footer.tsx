const APP_VERSION = "v0.1.0";

export function AppFooter() {
  return (
    <footer className="flex h-9 shrink-0 items-center justify-between border-t border-ramo-border bg-ramo-surface px-6 z-10">
      {/* Esquerda: identidade institucional */}
      <span className="text-xs text-ramo-muted">
        Ramo ERP · Sistema Interno
      </span>

      {/* Centro: slot futuro — status do sistema */}
      <div className="hidden sm:flex items-center gap-1.5">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-ramo-success" />
        <span className="text-xs text-ramo-muted">Sistema operacional</span>
      </div>

      {/* Direita: versão */}
      <span className="text-xs text-ramo-muted tabular-nums">
        {APP_VERSION}
      </span>
    </footer>
  );
}
