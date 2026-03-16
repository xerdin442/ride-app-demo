import { HomeContent } from "@/components/HomeContent";
import { Suspense } from "react";

function HomeFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-b from-white to-gray-50">
      <Suspense fallback={<HomeFallback />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
