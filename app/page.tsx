"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BabyInputForm } from "@/components/baby-input-form";
import { generateRecommendations } from "@/lib/api";
import { BabyData, RecommendationType } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Baby, Heart, Brain, Dumbbell } from "lucide-react";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationType | null>(null);
  const [babyData, setBabyData] = useState<BabyData | null>(null);
  const router = useRouter();

  const handleSubmit = async (data: BabyData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("提交的宝宝数据:", data); // 调试信息
      const generatedRecommendations = await generateRecommendations(data);
      console.log("生成的建议:", generatedRecommendations); // 调试信息
      
      setRecommendations(generatedRecommendations);
      setBabyData(data);
      
      // Store data in localStorage for backup
      localStorage.setItem("babyData", JSON.stringify(data));
      localStorage.setItem("recommendations", JSON.stringify(generatedRecommendations));
      
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setError(error instanceof Error ? error.message : "生成建议时出现错误，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setRecommendations(null);
    setBabyData(null);
    setError(null);
  };

  // 如果有推荐结果，显示结果页面
  if (recommendations && babyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Baby className="h-12 w-12 text-primary mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">
                {babyData.gender === 'male' ? '小王子' : '小公主'}专属育儿建议
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              {babyData.age}个月宝宝的个性化建议
            </p>
            <button 
              onClick={handleBackToForm}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              重新填写信息
            </button>
          </div>

          {/* Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Food Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-6 w-6 text-red-500 mr-2" />
                  营养辅食建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line text-sm">{recommendations.food}</div>
              </CardContent>
            </Card>

            {/* Activity Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Baby className="h-6 w-6 text-blue-500 mr-2" />
                  互动活动建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line text-sm">{recommendations.activity}</div>
              </CardContent>
            </Card>

            {/* Development Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-6 w-6 text-purple-500 mr-2" />
                  智力开发建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line text-sm">{recommendations.development}</div>
              </CardContent>
            </Card>

            {/* Exercise Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Dumbbell className="h-6 w-6 text-green-500 mr-2" />
                  运动锻炼建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line text-sm">{recommendations.exercise}</div>
              </CardContent>
            </Card>
          </div>

          {/* Baby Info Summary */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>宝宝信息总结</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><strong>年龄:</strong> {babyData.age}个月</div>
                <div><strong>性别:</strong> {babyData.gender === 'male' ? '男宝' : '女宝'}</div>
                <div><strong>体重:</strong> {babyData.weight}kg</div>
                <div><strong>身高:</strong> {babyData.height}cm</div>
                <div><strong>喂养方式:</strong> {
                  babyData.feedingMethod === 'breastfeeding' ? '母乳喂养' :
                  babyData.feedingMethod === 'formula' ? '配方奶粉' : '混合喂养'
                }</div>
                <div><strong>睡眠时间:</strong> {babyData.sleepHours}小时/天</div>
                {babyData.healthConditions && (
                  <div className="col-span-2"><strong>健康状况:</strong> {babyData.healthConditions}</div>
                )}
                {babyData.allergies && (
                  <div className="col-span-2"><strong>过敏史:</strong> {babyData.allergies}</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 加载状态
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

  // 表单页面
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