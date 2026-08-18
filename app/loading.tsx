// app/loading.tsx
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-ink/20 border-t-sunset" />
        <p className="hand mt-6 text-2xl text-mist">Hector démarre...</p>
      </div>
    </div>
  );
}