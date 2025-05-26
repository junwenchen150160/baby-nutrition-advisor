"use client";

import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("准备生成宝宝建议...");

  const messages = [
    "分析宝宝月龄特点...",
    "查询适合的食材组合...",
    "生成营养均衡的辅食建议...",
    "制定趣味亲子互动...",
    "设计适合的智力开发活动...",
    "推荐适合月龄的运动方式...",
    "完善个性化建议中...",
    "即将完成，请稍候..."
  ];

  useEffect(() => {
    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        
        // Change message at certain progress points
        const newProgress = prevProgress + Math.random() * 8;
        const messageIndex = Math.floor((newProgress / 100) * messages.length);
        if (messageIndex < messages.length) {
          setMessage(messages[messageIndex]);
        }
        
        return newProgress;
      });
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 rounded-full bg-blue-50 animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center text-5xl">👶</div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">智能生成中</h2>
          <p className="text-muted-foreground mb-6">{message}</p>
          
          <div className="w-full max-w-xs">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
}