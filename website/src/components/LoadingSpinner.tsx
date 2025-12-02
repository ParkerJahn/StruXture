'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        <p className="text-white mt-4 text-center">Loading...</p>
      </div>
    </div>
  );
}

