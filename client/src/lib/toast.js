import toast from "react-hot-toast";

const baseStyle = {
  background: "#111118",
  color: "#F0EFF8",
  border: "0.5px solid rgba(255,255,255,0.07)",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "13px",
  borderRadius: "12px",
  padding: "12px 14px",
};

const makeOptions = (type) => ({
  duration: type === "error" ? 5000 : 3200,
  style: baseStyle,
  ariaProps: {
    role: type === "error" ? "alert" : "status",
    "aria-live": type === "error" ? "assertive" : "polite",
  },
  success: {
    iconTheme: { primary: "#2DD4BF", secondary: "#0A0A0F" },
  },
  error: {
    iconTheme: { primary: "#F472B6", secondary: "#0A0A0F" },
  },
});

export const toastSuccess = (message, options = {}) =>
  toast.success(message, { ...makeOptions("success"), ...options });

export const toastError = (message, options = {}) =>
  toast.error(message, { ...makeOptions("error"), ...options });

export const toastInfo = (message, options = {}) =>
  toast(message, { ...makeOptions("info"), ...options });

export const toastAction = {
  saved: (message = "Saved successfully") => toastSuccess(message),
  published: (message = "Post published") => toastSuccess(message),
  updated: (message = "Changes saved") => toastSuccess(message),
  deleted: (message = "Deleted") => toastSuccess(message),
  submitted: (message = "Submitted") => toastSuccess(message),
  copied: (message = "Link copied to clipboard") => toastSuccess(message),
  welcomeBack: (message = "Welcome back") => toastSuccess(message),
  accountCreated: (message = "Account created") => toastSuccess(message),
  signedOut: (message = "Signed out") => toastSuccess(message),
};

export default toast;
