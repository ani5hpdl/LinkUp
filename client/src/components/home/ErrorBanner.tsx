interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <div className="max-w-3xl mx-auto mt-6 px-6">
      <div className="rounded-lg bg-lu-pink/10 border border-lu-pink/20 px-4 py-3 text-sm text-lu-pink">
        {message}
      </div>
    </div>
  );
}
