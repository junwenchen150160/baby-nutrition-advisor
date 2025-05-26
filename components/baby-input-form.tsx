"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BabyData } from "@/lib/types";

// Enhanced validation schema
const formSchema = z.object({
  age: z.number().min(1, "年龄必须大于0个月").max(60, "年龄不能超过60个月"),
  gender: z.enum(["male", "female"], {
    required_error: "请选择宝宝性别",
  }),
  weight: z.number().min(1, "体重必须大于0kg").max(50, "体重不能超过50kg").optional(),
  height: z.number().min(30, "身高必须大于30cm").max(150, "身高不能超过150cm").optional(),
  healthConditions: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  specialNotes: z.string().max(500, "特殊说明不能超过500字").optional(),
  feedingType: z.enum(["breastfeeding", "formula", "mixed"], {
    required_error: "请选择喂养方式",
  }),
  sleepHours: z.number().min(8, "睡眠时间不能少于8小时").max(16, "睡眠时间不能超过16小时"),
});

type FormData = z.infer<typeof formSchema>;

interface BabyInputFormProps {
  onSubmit: (data: BabyData) => void;
  isLoading?: boolean;
}

const commonHealthConditions = [
  "感冒", "发烧", "咳嗽", "腹泻", "便秘", "湿疹", "过敏性鼻炎"
];

const commonAllergies = [
  "牛奶蛋白", "鸡蛋", "花生", "坚果", "海鲜", "大豆", "小麦"
];

export function BabyInputForm({ onSubmit, isLoading = false }: BabyInputFormProps) {
  const [selectedHealthConditions, setSelectedHealthConditions] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [customHealthCondition, setCustomHealthCondition] = useState("");
  const [customAllergy, setCustomAllergy] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 12,
      gender: "male",
      feedingType: "mixed",
      sleepHours: 12,
    },
    mode: "onSubmit",
  });

  const watchedAge = watch("age");
  const watchedGender = watch("gender");
  const watchedFeedingType = watch("feedingType");

  const handleHealthConditionChange = (condition: string, checked: boolean) => {
    const updated = checked
      ? [...selectedHealthConditions, condition]
      : selectedHealthConditions.filter(c => c !== condition);
    setSelectedHealthConditions(updated);
  };

  const handleAllergyChange = (allergy: string, checked: boolean) => {
    const updated = checked
      ? [...selectedAllergies, allergy]
      : selectedAllergies.filter(a => a !== allergy);
    setSelectedAllergies(updated);
  };

  const addCustomHealthCondition = () => {
    if (customHealthCondition.trim() && !selectedHealthConditions.includes(customHealthCondition.trim())) {
      setSelectedHealthConditions([...selectedHealthConditions, customHealthCondition.trim()]);
      setCustomHealthCondition("");
    }
  };

  const addCustomAllergy = () => {
    if (customAllergy.trim() && !selectedAllergies.includes(customAllergy.trim())) {
      setSelectedAllergies([...selectedAllergies, customAllergy.trim()]);
      setCustomAllergy("");
    }
  };

  const onFormSubmit = (data: FormData) => {
    const babyData: BabyData = {
      age: data.age,
      gender: data.gender,
      weight: data.weight,
      height: data.height,
      healthConditions: selectedHealthConditions.length > 0 ? selectedHealthConditions : undefined,
      allergies: selectedAllergies.length > 0 ? selectedAllergies : undefined,
      specialNotes: data.specialNotes,
      feedingType: data.feedingType,
      sleepHours: data.sleepHours,
    };
    onSubmit(babyData);
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
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">宝宝年龄: {watchedAge} 个月</Label>
              <Slider
                value={[watchedAge || 12]}
                onValueChange={(value) => setValue("age", value[0])}
                max={60}
                min={1}
                step={1}
                className="w-full"
              />
              {errors.age && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.age.message}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-3">
              <Label>宝宝性别</Label>
              <RadioGroup
                value={watchedGender}
                onValueChange={(value) => setValue("gender", value as "male" | "female")}
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
              {errors.gender && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.gender.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Physical Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">体重 (kg) - 可选</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="例如: 10.5"
                {...register("weight", { valueAsNumber: true })}
              />
              {errors.weight && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.weight.message}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">身高 (cm) - 可选</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                placeholder="例如: 75.5"
                {...register("height", { valueAsNumber: true })}
              />
              {errors.height && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.height.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Feeding Information */}
          <div className="space-y-3">
            <Label>喂养方式</Label>
            <RadioGroup
              value={watchedFeedingType}
              onValueChange={(value) => setValue("feedingType", value as "breastfeeding" | "formula" | "mixed")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="breastfeeding" id="breastfeeding" />
                <Label htmlFor="breastfeeding">母乳喂养</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="formula" id="formula" />
                <Label htmlFor="formula">配方奶喂养</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mixed" id="mixed" />
                <Label htmlFor="mixed">混合喂养</Label>
              </div>
            </RadioGroup>
            {errors.feedingType && (
              <Alert variant="destructive">
                <AlertDescription>{errors.feedingType.message}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Sleep Information */}
          <div className="space-y-2">
            <Label htmlFor="sleepHours">每日睡眠时间: {watch("sleepHours") || 12} 小时</Label>
            <Slider
              value={[watch("sleepHours") || 12]}
              onValueChange={(value) => setValue("sleepHours", value[0])}
              max={16}
              min={8}
              step={0.5}
              className="w-full"
            />
            {errors.sleepHours && (
              <Alert variant="destructive">
                <AlertDescription>{errors.sleepHours.message}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Health Conditions */}
          <div className="space-y-3">
            <Label>健康状况 (可多选)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {commonHealthConditions.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={condition}
                    checked={selectedHealthConditions.includes(condition)}
                    onCheckedChange={(checked) => 
                      handleHealthConditionChange(condition, checked as boolean)
                    }
                  />
                  <Label htmlFor={condition} className="text-sm">{condition}</Label>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="其他健康状况"
                value={customHealthCondition}
                onChange={(e) => setCustomHealthCondition(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomHealthCondition())}
              />
              <Button type="button" variant="outline" onClick={addCustomHealthCondition}>
                添加
              </Button>
            </div>
          </div>

          {/* Allergies */}
          <div className="space-y-3">
            <Label>过敏史 (可多选)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {commonAllergies.map((allergy) => (
                <div key={allergy} className="flex items-center space-x-2">
                  <Checkbox
                    id={allergy}
                    checked={selectedAllergies.includes(allergy)}
                    onCheckedChange={(checked) => 
                      handleAllergyChange(allergy, checked as boolean)
                    }
                  />
                  <Label htmlFor={allergy} className="text-sm">{allergy}</Label>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="其他过敏源"
                value={customAllergy}
                onChange={(e) => setCustomAllergy(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAllergy())}
              />
              <Button type="button" variant="outline" onClick={addCustomAllergy}>
                添加
              </Button>
            </div>
          </div>

          {/* Special Notes */}
          <div className="space-y-2">
            <Label htmlFor="specialNotes">特殊说明 (可选)</Label>
            <Textarea
              id="specialNotes"
              placeholder="请描述宝宝的特殊情况、偏好或其他需要注意的事项..."
              className="min-h-[100px]"
              {...register("specialNotes")}
            />
            {errors.specialNotes && (
              <Alert variant="destructive">
                <AlertDescription>{errors.specialNotes.message}</AlertDescription>
              </Alert>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? "正在生成建议..." : "获取个性化建议"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}