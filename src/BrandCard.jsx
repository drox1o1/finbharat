/* The e1 surface everything sits on: layered shadow plus a hue-tinted hairline
   border, radius-card, content-driven height. */
export function Card({ children, title, subtitle, trailing, footer, padding = "var(--card-padding)", elevation = "e1", style, ...rest }) {
  const shadow = elevation === "none" ? "none" : `var(--shadow-${elevation})`;
  return (
    <section
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border-hairline)",
        borderRadius: "var(--radius-card)",
        boxShadow: shadow,
        padding,
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
        minWidth: 0,
        ...style,
      }}
      {...rest}
    >
      {title || trailing ? (
        <header style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)", minWidth: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: "1 1 auto" }}>
            {title ? <h3 className="fb-title" style={{ color: "var(--text-strong)" }}>{title}</h3> : null}
            {subtitle ? <p className="fb-caption fb-muted" style={{ margin: 0 }}>{subtitle}</p> : null}
          </div>
          {trailing ? <div style={{ flex: "0 0 auto" }}>{trailing}</div> : null}
        </header>
      ) : null}
      {children}
      {footer ? (
        <footer style={{ paddingTop: "var(--space-3)", borderTop: "1px solid var(--border)", display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>{footer}</footer>
      ) : null}
    </section>
  );
}
