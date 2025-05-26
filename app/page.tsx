"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // 自动跳转到推荐页面
    router.push("/recommender");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">🍼 宝宝今日吃啥</h1>
        <p className="text-gray-600 mb-4">正在跳转到宝宝推荐页面...</p>
        <p className="text-sm text-gray-500">
          如果没有自动跳转，请点击
          <button 
            onClick={() => router.push("/recommender")}
            className="text-blue-600 hover:text-blue-800 underline ml-1"
          >
            这里
          </button>
        </p>
      </div>
    </div>
  );
}