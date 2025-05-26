"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Heart, 
  Baby, 
  Brain, 
  Dumbbell,
  Calendar,
  Weight,
  Ruler,
  Clock,
  AlertTriangle
} from "lucide-react";
import { BabyData, RecommendationType } from "@/lib/types";

export default function ResultsPage() {
  const [recommendations, setRecommendations] = useState<RecommendationType | null>(null);
  const [babyData, setBabyData] = useState<BabyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedRecommendations = localStorage.getItem("recommendations");
    const storedBabyData = localStorage.getItem("babyData");
    
    if (storedRecommendations && storedBabyData) {
      try {
        setRecommendations(JSON.parse(storedRecommendations));
        setBabyData(JSON.parse(storedBabyData));
      } catch (error) {
        console.error("Error parsing stored data:", error);
        router.push("/recommender");
        return;
      }
    } else {
      router.push("/recommender");
      return;
    }
    
    setIsLoading(false);
  }, [router]);

  const handleShare = async () => {
    if (navigator.share && recommendations && babyData) {
      try {
        await navigator.share({
          title: "宝宝个性化育儿建议",
          text: `为${babyData.age}个月大的${babyData.gender === 'male' ? '男' : '女'}宝宝生成的专属育儿建议`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("分享失败:", error);
      }
    } else {
      // Fallback: copy to clipboard
      const text = `宝宝个性化育儿建议\n\n${recommendations?.food}\n\n${recommendations?.activity}\n\n${recommendations?.development}\n\n${recommendations?.exercise}`;
      navigator.clipboard.writeText(text);
      alert("建议已复制到剪贴板！");
    }
  };

  const handleDownload = () => {
    if (!recommendations || !babyData) return;
    
    const content = `宝宝个性化育儿建议
生成时间：${new Date().toLocaleString()}

宝宝信息：
- 年龄：${babyData.age}个月
- 性别：${babyData.gender === 'male' ? '男宝宝' : '女宝宝'}
${babyData.weight ? `- 体重：${babyData.weight}kg` : ''}
${babyData.height ? `- 身高：${babyData.height}cm` : ''}
${babyData.feedingType ? `- 喂养方式：${getFeedingTypeText(babyData.feedingType)}` : ''}
${babyData.sleepHours ? `- 睡眠时间：${babyData.sleepHours}小时/天` : ''}
${babyData.healthConditions?.length ? `- 健康状况：${babyData.healthConditions.join('、')}` : ''}
${babyData.allergies?.length ? `- 过敏史：${babyData.allergies.join('、')}` : ''}
${babyData.specialNotes ? `- 特殊说明：${babyData.specialNotes}` : ''}

${recommendations.food}

${recommendations.activity}

${recommendations.development}

${recommendations.exercise}

注意：本建议仅供参考，如有特殊情况请咨询专业医生。`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `宝宝育儿建议_${babyData.age}个月_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFeedingTypeText = (type: string) => {
    switch (type) {
      case 'breastfeeding': return '母乳喂养';
      case 'formula': return '配方奶喂养';
      case 'mixed': return '混合喂养';
      default: return type;
    }
  };

  const getGenderText = (gender: string) => {
    return gender === 'male' ? '男宝宝' : '女宝宝';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>正在加载建议...</p>
        </div>
      </div>
    );
  }

  if (!recommendations || !babyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">未找到建议数据</h3>
            <p className="text-muted-foreground mb-4">
              请重新填写宝宝信息以获取个性化建议
            </p>
            <Button onClick={() => router.push("/recommender")}>
              重新开始
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/recommender")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            重新生成
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              分享
            </Button>
            <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              下载
            </Button>
          </div>
        </div>

        {/* Baby Info Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5" />
              宝宝信息概览
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  <span className="font-medium">{babyData.age}</span> 个月
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Baby className="h-4 w-4 text-pink-500" />
                <span className="text-sm">{getGenderText(babyData.gender)}</span>
              </div>
              {babyData.weight && (
                <div className="flex items-center gap-2">
                  <Weight className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{babyData.weight} kg</span>
                </div>
              )}
              {babyData.height && (
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">{babyData.height} cm</span>
                </div>
              )}
              {babyData.sleepHours && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm">{babyData.sleepHours} 小时/天</span>
                </div>
              )}
              {babyData.feedingType && (
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm">{getFeedingTypeText(babyData.feedingType)}</span>
                </div>
              )}
            </div>
            
            {(babyData.healthConditions?.length || babyData.allergies?.length) && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  {babyData.healthConditions?.length && (
                    <div>
                      <span className="text-sm font-medium">健康状况：</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {babyData.healthConditions.map((condition, index) => (
                          <Badge key={index} variant="secondary">{condition}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {babyData.allergies?.length && (
                    <div>
                      <span className="text-sm font-medium">过敏史：</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {babyData.allergies.map((allergy, index) => (
                          <Badge key={index} variant="destructive">{allergy}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {babyData.specialNotes && (
              <>
                <Separator className="my-4" />
                <div>
                  <span className="text-sm font-medium">特殊说明：</span>
                  <p className="text-sm text-muted-foreground mt-1">{babyData.specialNotes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>个性化育儿建议</CardTitle>
            <CardDescription>
              基于您宝宝的具体情况生成的专属建议，建议收藏备用
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="food" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="food" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">科学辅食</span>
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Baby className="h-4 w-4" />
                  <span className="hidden sm:inline">亲子互动</span>
                </TabsTrigger>
                <TabsTrigger value="development" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span className="hidden sm:inline">智力开发</span>
                </TabsTrigger>
                <TabsTrigger value="exercise" className="flex items-center gap-2">
                  <Dumbbell className="h-4 w-4" />
                  <span className="hidden sm:inline">运动锻炼</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="food" className="mt-6">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {recommendations.food}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="activity" className="mt-6">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {recommendations.activity}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="development" className="mt-6">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {recommendations.development}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="exercise" className="mt-6">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {recommendations.exercise}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Alert className="mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>重要提醒：</strong>
            本建议基于科学育儿理念和中医调养原理生成，仅供参考。每个宝宝的发育情况不同，
            如有特殊情况或疑虑，请及时咨询儿科医生或专业育儿顾问。
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}