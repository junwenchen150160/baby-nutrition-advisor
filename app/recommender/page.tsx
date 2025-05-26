"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BabyInputForm } from "@/components/baby-input-form";
import { generateRecommendations } from "@/lib/api";
import { BabyData, RecommendationType } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Baby, Heart, Brain, Dumbbell } from "lucide-react";

export default function RecommenderPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (data: BabyData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const recommendations = await generateRecommendations(data);
      
      // Store data in localStorage for the results page
      localStorage.setItem("babyData", JSON.stringify(data));
      localStorage.setItem("recommendations", JSON.stringify(recommendations));
      
      // Navigate to results page
      router.push("/results");
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setError(error instanceof Error ? error.message : "生成建议时出现错误，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="text-center">
                <h3 className="text-lg font-semibold">正在生成个性化建议</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  我们正在根据您宝宝的信息生成专属的育儿建议，请稍候...
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Baby className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">宝宝今日吃啥</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            基于科学育儿理念，为您的宝宝提供个性化的饮食、运动、智力开发建议
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-4">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h3 className="font-semibold">科学辅食</h3>
              <p className="text-sm text-muted-foreground">营养均衡的饮食建议</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <Baby className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold">亲子互动</h3>
              <p className="text-sm text-muted-foreground">增进感情的游戏活动</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold">智力开发</h3>
              <p className="text-sm text-muted-foreground">促进大脑发育的训练</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <Dumbbell className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold">运动锻炼</h3>
              <p className="text-sm text-muted-foreground">适合年龄的体能训练</p>
            </CardContent>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <BabyInputForm onSubmit={handleSubmit} isLoading={isLoading} />

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            本应用基于科学育儿理念和中医调养原理，建议仅供参考。
            如有特殊情况，请咨询专业医生。
          </p>
        </div>
      </div>
    </div>
  );
}