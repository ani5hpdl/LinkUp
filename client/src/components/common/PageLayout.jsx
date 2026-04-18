import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function PageLayout({ children, aside }) {
  return (
    <div className="lu-shell" style={{ minHeight: "100vh", background: "var(--lu-bg)" }}>
      <Navbar />
      <div
        className="lu-shell-grid"
        style={{
          "--lu-shell-columns": aside
            ? "234px minmax(0, 1fr) 280px"
            : "234px minmax(0, 1fr)",
          maxWidth: "var(--lu-shell-width)",
          margin: "0 auto",
          padding: "1.5rem var(--lu-shell-pad)",
          display: "grid",
          gap: "1.25rem",
          alignItems: "start",
        }}
      >
        <Sidebar />
        <main className="page-enter" style={{ minWidth: 0 }}>
          {children}
        </main>
        {aside && (
          <aside style={{ minWidth: 0 }}>
            {aside}
          </aside>
        )}
      </div>
    </div>
  );
}
