export default function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="lu-section-shell" style={{ alignItems: "start", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap" }}>
      <div style={{ minWidth: 0 }}>
        {eyebrow && <div className="lu-kicker" style={{ marginBottom: 8 }}>{eyebrow}</div>}
        <h1 className="lu-section-title">{title}</h1>
        {subtitle && <p className="lu-section-subtitle">{subtitle}</p>}
      </div>
      {actions && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{actions}</div>}
    </div>
  );
}
