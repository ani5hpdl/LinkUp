import { Toaster as HotToaster } from "react-hot-toast";

export default function Toaster() {
  return (
    <HotToaster
      position="bottom-right"
      gutter={12}
      toastOptions={{
        duration: 3200,
        style: {
          background: "#111118",
          color: "#F0EFF8",
          border: "0.5px solid rgba(255,255,255,0.07)",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13px",
          borderRadius: "12px",
          padding: "12px 14px",
        },
        success: {
          iconTheme: { primary: "#2DD4BF", secondary: "#0A0A0F" },
        },
        error: {
          duration: 5000,
          iconTheme: { primary: "#F472B6", secondary: "#0A0A0F" },
        },
      }}
    />
  );
}
