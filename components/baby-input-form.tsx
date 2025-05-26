"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BabyData } from "@/lib/types";

interface BabyInputFormProps {
  onSubmit: (data: BabyData) => void;
  isLoading?: boolean;
}

export function BabyInputForm({ onSubmit, isLoading = false }: BabyInputFormProps) {
  const [formData, setFormData] = useState<BabyData>({
    age: 12,
    gender: "male",
    weight: 10,
    height: 75,
    healthConditions: "",
    allergies: "",
    notes: "",
    feedingMethod: "mixed",
    sleepHours: 12,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateFormData = (field: keyof BabyData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">宝宝信息</CardTitle>
        <CardDescription className="text-center">
          请填写宝宝的基本信息，我们将为您提供个性化的育儿建议
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>宝宝年龄: {formData.age} 个月</Label>
              <Slider
                value={[formData.age]}
                onValueChange={(value: number[]) => updateFormData('age', value[0])}
                max={60}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <Label>宝宝性别</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value: string) => updateFormData('gender', value as "male" | "female")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">男宝宝</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">女宝宝</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Physical Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">体重 (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => updateFormData('weight', parseFloat(e.target.value) || 0)}
                placeholder="例如: 10.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">身高 (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                value={formData.height}
                onChange={(e) => updateFormData('height', parseFloat(e.target.value) || 0)}
                placeholder="例如: 75.5"
              />
            </div>
          </div>

          {/* Feeding and Sleep */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label>喂养方式</Label>
              <RadioGroup
                value={formData.feedingMethod}
                onValueChange={(value: string) => updateFormData('feedingMethod', value as "breastfeeding" | "formula" | "mixed")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="breastfeeding" id="breastfeeding" />
                  <Label htmlFor="breastfeeding">母乳喂养</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="formula" id="formula" />
                  <Label htmlFor="formula">配方奶粉</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mixed" id="mixed" />
                  <Label htmlFor="mixed">混合喂养</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>睡眠时间: {formData.sleepHours} 小时/天</Label>
              <Slider
                value={[formData.sleepHours]}
                onValueChange={(value: number[]) => updateFormData('sleepHours', value[0])}
                max={18}
                min={8}
                step={0.5}
                className="w-full"
              />
            </div>
          </div>

          {/* Health Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="healthConditions">健康状况</Label>
              <Textarea
                id="healthConditions"
                value={formData.healthConditions}
                onChange={(e) => updateFormData('healthConditions', e.target.value)}
                placeholder="请描述宝宝的健康状况，如有无感冒、发烧、湿疹等..."
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">过敏史</Label>
              <Textarea
                id="allergies"
                value={formData.allergies}
                onChange={(e) => updateFormData('allergies', e.target.value)}
                placeholder="请描述宝宝的过敏情况，如对牛奶、鸡蛋、坚果等的过敏..."
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">特殊说明</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateFormData('notes', e.target.value)}
                placeholder="请描述宝宝的特殊情况、偏好或其他需要注意的事项..."
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "正在生成建议..." : "获取个性化建议"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}