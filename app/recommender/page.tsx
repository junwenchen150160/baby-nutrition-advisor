"use client";

import { useState, useEffect } from "react";
import { generateRecommendation, getPopularQuestions, RecommendationResult } from "@/lib/recommend";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function RecommenderPage() {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [popularQuestions, setPopularQuestions] = useState<string[]>([]);

  useEffect(() => {
    setPopularQuestions(getPopularQuestions());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError("请输入您的问题");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const recommendation = await generateRecommendation(question);
      setResult(recommendation);
    } catch (err) {
      setError("生成建议时出现错误，请稍后重试");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (selectedQuestion: string) => {
    setQuestion(selectedQuestion);
    setResult(null);
    setError(null);
  };

  const handleNewQuestion = () => {
    setQuestion("");
    setResult(null);
    setError(null);
  };

  // 结果展示页面
  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Button 
              onClick={handleNewQuestion}
              className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              ← 问新问题
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">🍼 营养建议</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {result.category}
            </p>
          </div>

          {/* 用户问题 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">您的问题</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 italic">"{result.question}"</p>
            </CardContent>
          </Card>

          {/* 主要回答 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                ❤️ 专业建议
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800 leading-relaxed">{result.answer}</p>
            </CardContent>
          </Card>

          {/* 实用小贴士 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                💡 实用小贴士
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 相关问题 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                🧠 相关问题
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {result.relatedQuestions.map((relatedQ, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-3 text-sm border rounded-lg hover:bg-blue-50 transition-colors"
                    onClick={() => handleQuestionClick(relatedQ)}
                  >
                    <span className="text-blue-600 hover:text-blue-800">{relatedQ}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 问题输入页面
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🍼 宝宝营养顾问</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            专业的婴幼儿营养建议，基于科学育儿理念
          </p>
        </div>

        {/* 输入区域 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>请输入您的问题</CardTitle>
            <CardDescription>
              例如：6个月宝宝可以吃什么辅食？宝宝过敏了怎么办？
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="请输入关于宝宝营养、喂养、健康等相关问题..."
                className="min-h-[100px] resize-none"
                disabled={isLoading}
              />
              
              {error && (
                <Alert>
                  <AlertDescription className="text-red-600">{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading || !question.trim()}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    正在分析问题...
                  </>
                ) : (
                  <>
                    📤 获取专业建议
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 热门问题 */}
        <Card>
          <CardHeader>
            <CardTitle>🔥 热门问题</CardTitle>
            <CardDescription>点击下方问题快速获取答案</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {popularQuestions.map((popularQ, index) => (
                <button
                  key={index}
                  className="h-auto p-4 text-left text-sm leading-relaxed border rounded-lg hover:bg-blue-50 transition-colors"
                  onClick={() => handleQuestionClick(popularQ)}
                  disabled={isLoading}
                >
                  <span className="text-gray-700">{popularQ}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            本应用基于科学育儿理念提供建议，仅供参考。
            如有特殊情况，请咨询专业儿科医生。
          </p>
        </div>
      </div>
    </div>
  );
}