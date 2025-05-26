"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2 } from "lucide-react";

interface RecommendationDisplayProps {
  title: string;
  content: string;
  icon: string;
}

export function RecommendationDisplay({ title, content, icon }: RecommendationDisplayProps) {
  const [saved, setSaved] = useState(false);
  
  const handleSave = () => {
    setSaved(!saved);
    // In a real app, we would save this to localStorage or a database
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `宝宝今日推荐 - ${title}`,
          text: content,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(content);
      alert("内容已复制到剪贴板!");
    }
  };
  
  // Format the content with proper line breaks and sections
  const formattedContent = content.split('\n').map((line, i) => (
    <p key={i} className={`${line.startsWith('#') ? 'font-medium text-lg mt-4 mb-2' : 'mb-3'}`}>
      {line.startsWith('#') ? line.substring(1).trim() : line}
    </p>
  ));

  return (
    <Card className="shadow-md border-none overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-pink-50 dark:from-blue-950/50 dark:to-pink-950/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-4xl">{icon}</div>
            <CardTitle>{title}</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleSave}
              className={saved ? "text-primary" : ""}
            >
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="prose dark:prose-invert max-w-none">
          {formattedContent}
        </div>
      </CardContent>
    </Card>
  );
}