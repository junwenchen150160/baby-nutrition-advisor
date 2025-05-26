import { BabyData, RecommendationType } from './types';

// 智能个性化推荐算法
function generatePersonalizedRecommendations(data: BabyData): RecommendationType {
  const { age, gender, weight, height, feedingMethod, sleepHours, healthConditions, allergies, notes } = data;
  
  // 根据年龄判断发育阶段
  const ageStage = age < 6 ? 'infant' : age < 12 ? 'early' : age < 24 ? 'toddler' : 'preschool';
  
  // 分析体重状况
  const weightStatus = analyzeWeightStatus(age, weight, height);
  
  // 分析睡眠状况
  const sleepStatus = analyzeSleepStatus(sleepHours, age);
  
  // 分析健康状况和过敏
  const healthAnalysis = analyzeHealthConditions(healthConditions, allergies);

  return {
    food: generateSmartFoodRecommendations(data, ageStage, weightStatus, healthAnalysis),
    activity: generateSmartActivityRecommendations(data, ageStage, sleepStatus),
    development: generateSmartDevelopmentRecommendations(data, ageStage),
    exercise: generateSmartExerciseRecommendations(data, ageStage, weightStatus)
  };
}

function analyzeWeightStatus(age: number, weight: number, height: number): 'underweight' | 'normal' | 'overweight' {
  // 基于WHO生长曲线的简化评估
  const expectedWeight = age < 12 ? (age * 0.5 + 3.5) : (age * 0.3 + 9);
  const weightRatio = weight / expectedWeight;
  
  if (weightRatio < 0.85) return 'underweight';
  if (weightRatio > 1.15) return 'overweight';
  return 'normal';
}

function analyzeSleepStatus(sleepHours: number, age: number): 'insufficient' | 'normal' | 'excessive' {
  const expectedSleep = age < 6 ? 16 : age < 12 ? 14 : age < 24 ? 13 : 12;
  
  if (sleepHours < expectedSleep - 2) return 'insufficient';
  if (sleepHours > expectedSleep + 3) return 'excessive';
  return 'normal';
}

function analyzeHealthConditions(health: string, allergies: string): {
  hasEczema: boolean;
  hasDigestiveIssues: boolean;
  hasAllergies: string[];
  needsSpecialCare: boolean;
} {
  const healthLower = health.toLowerCase();
  const allergiesLower = allergies.toLowerCase();
  
  return {
    hasEczema: healthLower.includes('湿疹') || allergiesLower.includes('湿疹'),
    hasDigestiveIssues: healthLower.includes('便秘') || healthLower.includes('腹泻') || healthLower.includes('消化'),
    hasAllergies: [
      allergiesLower.includes('牛奶') ? '牛奶' : '',
      allergiesLower.includes('鸡蛋') ? '鸡蛋' : '',
      allergiesLower.includes('坚果') ? '坚果' : '',
      allergiesLower.includes('海鲜') ? '海鲜' : ''
    ].filter(Boolean),
    needsSpecialCare: health.trim() !== '' || allergies.trim() !== ''
  };
}

function generateSmartFoodRecommendations(data: BabyData, ageStage: string, weightStatus: string, healthAnalysis: any): string {
  const { age, gender, feedingMethod } = data;
  
  let recommendations = `🍼 ${gender === 'male' ? '小王子' : '小公主'}专属营养方案（${age}个月）\n\n`;
  
  // 性别化建议
  const genderAdvice = gender === 'male' 
    ? '男宝宝新陈代谢较快，建议适当增加蛋白质和能量摄入，支持活跃的身体发育' 
    : '女宝宝对铁质需求较高，建议多食用富含铁的食物，如强化米粉、瘦肉泥等';
  
  recommendations += `#性别特点\n${genderAdvice}\n\n`;
  
  // 根据年龄段的基础建议
  switch (ageStage) {
    case 'infant':
      recommendations += `#初期辅食（${age}个月）\n`;
      recommendations += `• 首选强化铁米粉，每天1-2次\n`;
      recommendations += `• 单一蔬菜泥：胡萝卜、南瓜、红薯（轮换尝试）\n`;
      recommendations += `• 水果泥：苹果、香蕉、梨（少量开始）\n`;
      recommendations += `• 观察期：每种新食物试3-5天\n\n`;
      break;
    case 'early':
      recommendations += `#丰富辅食（${age}个月）\n`;
      recommendations += `• 蛋白质：蛋黄、鱼肉泥、豆腐泥\n`;
      recommendations += `• 谷物：软烂面条、小米粥、燕麦糊\n`;
      recommendations += `• 蔬菜：西兰花、菠菜、胡萝卜（剁碎）\n`;
      recommendations += `• 水果：香蕉块、蒸苹果、牛油果\n\n`;
      break;
    case 'toddler':
      recommendations += `#家庭饮食过渡（${age}个月）\n`;
      recommendations += `• 主食：软米饭、面条、小馄饨\n`;
      recommendations += `• 蛋白质：全蛋、鱼肉、瘦肉丁、豆制品\n`;
      recommendations += `• 蔬果：各种应季蔬菜水果，少盐少糖\n`;
      recommendations += `• 奶制品：配方奶或纯牛奶300-500ml\n\n`;
      break;
    default:
      recommendations += `#均衡膳食（${age}个月）\n`;
      recommendations += `• 三餐规律：早中晚正餐+上下午加餐\n`;
      recommendations += `• 食物多样：谷类、蛋白质、蔬菜、水果均衡\n`;
      recommendations += `• 培养习惯：自主进食、细嚼慢咽\n`;
      recommendations += `• 健康零食：坚果、酸奶、水果\n\n`;
  }
  
  // 体重状况调整
  if (weightStatus === 'underweight') {
    recommendations += `#增重方案\n`;
    recommendations += `⚠️ 当前体重偏轻，建议：\n`;
    recommendations += `• 增加餐次：每天5-6次，少量多餐\n`;
    recommendations += `• 高能量食物：牛油果、坚果酱、全脂酸奶\n`;
    recommendations += `• 优质蛋白：鸡蛋、鱼肉、豆制品每天都要有\n`;
    recommendations += `• 健康脂肪：橄榄油、亚麻籽油适量添加\n\n`;
  } else if (weightStatus === 'overweight') {
    recommendations += `#控重方案\n`;
    recommendations += `⚠️ 当前体重偏重，建议：\n`;
    recommendations += `• 控制总量：适量减少每餐分量\n`;
    recommendations += `• 增加蔬菜：每餐蔬菜占一半以上\n`;
    recommendations += `• 减少油脂：少油少盐，清蒸水煮为主\n`;
    recommendations += `• 避免高糖：果汁、糖果、甜点要限制\n\n`;
  }
  
  // 喂养方式建议
  recommendations += `#喂养指导\n`;
  switch (feedingMethod) {
    case 'breastfeeding':
      recommendations += `• 母乳喂养：继续保持，是最佳营养来源\n`;
      recommendations += `• 辅食搭配：母乳后1小时再喂辅食\n`;
      recommendations += `• 建议继续：世卫组织推荐母乳喂养至2岁\n`;
      break;
    case 'formula':
      recommendations += `• 配方奶：选择适合月龄的配方，按说明冲调\n`;
      recommendations += `• 奶量控制：${age < 12 ? '每天600-800ml' : '每天400-600ml'}\n`;
      recommendations += `• 辅食配合：先喂辅食再喂奶，培养食欲\n`;
      break;
    case 'mixed':
      recommendations += `• 混合喂养：优先母乳，配方奶补充\n`;
      recommendations += `• 规律安排：固定时间喂母乳和配方奶\n`;
      recommendations += `• 逐步调整：根据母乳量调整配方奶用量\n`;
      break;
  }
  recommendations += `\n`;
  
  // 健康状况调整
  if (healthAnalysis.needsSpecialCare) {
    recommendations += `#特殊照护\n`;
    
    if (healthAnalysis.hasEczema) {
      recommendations += `• 湿疹护理：避免易致敏食物，选择低敏配方\n`;
    }
    
    if (healthAnalysis.hasDigestiveIssues) {
      recommendations += `• 消化调理：选择易消化食物，少量多餐\n`;
    }
    
    if (healthAnalysis.hasAllergies.length > 0) {
      recommendations += `• 过敏管理：严格避免${healthAnalysis.hasAllergies.join('、')}等过敏原\n`;
    }
    
    recommendations += `• 定期复查：及时咨询儿科医生调整方案\n\n`;
  }
  
  return recommendations;
}

function generateSmartActivityRecommendations(data: BabyData, ageStage: string, sleepStatus: string): string {
  const { age, gender, sleepHours, notes } = data;
  
  let activities = `🎮 ${gender === 'male' ? '小王子' : '小公主'}成长互动方案\n\n`;
  
  // 睡眠调理
  activities += `#作息管理\n`;
  switch (sleepStatus) {
    case 'insufficient':
      activities += `⚠️ 睡眠不足（当前${sleepHours}小时），建议：\n`;
      activities += `• 提前就寝：比现在早睡30-60分钟\n`;
      activities += `• 睡前仪式：洗澡→按摩→读书→睡觉\n`;
      activities += `• 环境优化：保持房间安静、昏暗、适温\n`;
      activities += `• 白天小憩：${age < 12 ? '上下午各1次' : '下午1次'}小睡\n\n`;
      break;
    case 'excessive':
      activities += `⚠️ 睡眠过多（当前${sleepHours}小时），建议：\n`;
      activities += `• 增加活动：白天多互动，减少小睡时间\n`;
      activities += `• 规律作息：固定起床和就寝时间\n`;
      activities += `• 观察状态：如果精神好就是正常个体差异\n\n`;
      break;
    default:
      activities += `✅ 睡眠充足（${sleepHours}小时），继续保持良好作息\n\n`;
  }
  
  // 年龄段活动
  switch (ageStage) {
    case 'infant':
      activities += `#感官启蒙（${age}个月）\n`;
      activities += `• 视觉刺激：黑白卡片、彩色玩具、镜子游戏\n`;
      activities += `• 听觉训练：轻柔音乐、妈妈歌声、摇铃声音\n`;
      activities += `• 触觉发展：不同材质玩具、温柔按摩\n`;
      activities += `• 情感联结：面对面交流、模仿表情、拥抱亲吻\n\n`;
      break;
    case 'early':
      activities += `#认知探索（${age}个月）\n`;
      activities += `• 手眼协调：抓握玩具、传递物品、指认游戏\n`;
      activities += `• 语言启蒙：重复词语、描述动作、简单指令\n`;
      activities += `• 社交技能：挥手再见、拍手游戏、模仿动作\n`;
      activities += `• 探索世界：安全爬行、触摸探索、因果游戏\n\n`;
      break;
    case 'toddler':
      activities += `#技能发展（${age}个月）\n`;
      activities += `• 精细动作：叠积木、画涂鸦、穿珠子\n`;
      activities += `• 语言表达：看图说话、简单对话、故事复述\n`;
      activities += `• 独立能力：自己吃饭、收拾玩具、穿脱衣物\n`;
      activities += `• 创造游戏：角色扮演、音乐舞蹈、想象游戏\n\n`;
      break;
    default:
      activities += `#全面发展（${age}个月）\n`;
      activities += `• 逻辑思维：分类游戏、数数活动、解决问题\n`;
      activities += `• 社会技能：分享合作、情绪表达、规则意识\n`;
      activities += `• 学习准备：认字识数、专注力训练、记忆游戏\n`;
      activities += `• 兴趣培养：艺术创作、科学探索、体育运动\n\n`;
  }
  
  // 性别特点
  if (gender === 'male') {
    activities += `#男宝特色\n`;
    activities += `• 大运动：多爬行、攀爬、跑跳等活动\n`;
    activities += `• 空间感：积木搭建、拼图、方向游戏\n`;
    activities += `• 竞技性：简单比赛、挑战游戏\n\n`;
  } else {
    activities += `#女宝特色\n`;
    activities += `• 精细动作：串珠、画画、手工制作\n`;
    activities += `• 语言发展：多对话、故事、歌曲\n`;
    activities += `• 情感表达：角色扮演、情绪识别\n\n`;
  }
  
  // 特殊关注
  if (notes) {
    activities += `#个性化关注\n`;
    activities += `根据您的备注"${notes}"，建议：\n`;
    activities += `• 针对性训练：重点关注相关发展领域\n`;
    activities += `• 耐心引导：每个宝宝发展节奏不同\n`;
    activities += `• 专业咨询：必要时寻求儿童发育专家建议\n\n`;
  }
  
  return activities;
}

function generateSmartDevelopmentRecommendations(data: BabyData, ageStage: string): string {
  const { age, gender } = data;
  
  let development = `🧠 ${gender === 'male' ? '小王子' : '小公主'}智力开发方案\n\n`;
  
  // 性别化智力发展
  const genderDevelopment = gender === 'male'
    ? '男宝宝通常在空间认知和大动作方面发展较快，建议多进行积木、拼图和运动类活动'
    : '女宝宝通常在语言和精细动作方面发展较早，建议多进行对话、阅读和手工活动';
  
  development += `#性别特点\n${genderDevelopment}\n\n`;
  
  // 分阶段发展重点
  switch (ageStage) {
    case 'infant':
      development += `#基础认知建立（${age}个月）\n`;
      development += `• 注意力训练：追视移动物体、注视人脸\n`;
      development += `• 记忆萌芽：重复游戏、熟悉的声音和图像\n`;
      development += `• 因果认知：按压发声玩具、摇动产生声响\n`;
      development += `• 空间感知：不同角度观察、远近距离体验\n\n`;
      break;
    case 'early':
      development += `#认知能力发展（${age}个月）\n`;
      development += `• 物体永久性：躲猫猫、寻找隐藏物品\n`;
      development += `• 分类概念：大小不同的物品、颜色区分\n`;
      development += `• 模仿学习：简单动作、声音、表情模仿\n`;
      development += `• 解决问题：够取远处物品、移除障碍物\n\n`;
      break;
    case 'toddler':
      development += `#逻辑思维萌芽（${age}个月）\n`;
      development += `• 分类排序：按颜色、形状、大小分类\n`;
      development += `• 数量概念：1-3的点数、多少比较\n`;
      development += `• 时间概念：先后顺序、日常作息规律\n`;
      development += `• 推理能力：简单的如果-那么关系\n\n`;
      break;
    default:
      development += `#复杂认知发展（${age}个月）\n`;
      development += `• 抽象思维：符号认知、想象游戏\n`;
      development += `• 逻辑推理：多步骤问题解决\n`;
      development += `• 记忆策略：分类记忆、联想记忆\n`;
      development += `• 创造性思维：开放性问题、多种解决方案\n\n`;
  }
  
  // 每日训练计划
  development += `#每日训练计划\n`;
  development += `• 上午（9-11点）：精细动作 + 认知游戏\n`;
  development += `• 下午（3-5点）：语言交流 + 探索活动\n`;
  development += `• 晚上（7-8点）：亲子阅读 + 音乐时光\n`;
  development += `• 每次15-30分钟，观察宝宝兴趣和疲劳状态\n\n`;
  
  return development;
}

function generateSmartExerciseRecommendations(data: BabyData, ageStage: string, weightStatus: string): string {
  const { age, gender, weight, height } = data;
  
  let exercise = `🏃‍♀️ ${gender === 'male' ? '小王子' : '小公主'}运动发展方案\n\n`;
  
  // 体重状况调整
  if (weightStatus === 'underweight') {
    exercise += `#体重管理运动\n`;
    exercise += `⚠️ 体重偏轻，运动重点：\n`;
    exercise += `• 适度运动：避免过度消耗体力\n`;
    exercise += `• 肌肉发展：重点进行力量性活动\n`;
    exercise += `• 食欲促进：适量活动刺激食欲\n\n`;
  } else if (weightStatus === 'overweight') {
    exercise += `#体重管理运动\n`;
    exercise += `⚠️ 体重偏重，运动重点：\n`;
    exercise += `• 增加活动：每天至少1小时身体活动\n`;
    exercise += `• 有氧运动：爬行、走路、游戏等\n`;
    exercise += `• 家庭参与：全家一起运动增加趣味\n\n`;
  }
  
  // 年龄段运动方案
  switch (ageStage) {
    case 'infant':
      exercise += `#基础运动发展（${age}个月）\n`;
      exercise += `• 颈部力量：俯卧抬头，每天累计30分钟\n`;
      exercise += `• 核心肌群：支撑坐立，逐渐减少辅助\n`;
      exercise += `• 四肢协调：蹬腿运动、抓握练习\n`;
      exercise += `• 感觉统合：不同姿势体验、平衡刺激\n\n`;
      break;
    case 'early':
      exercise += `#运动技能发展（${age}个月）\n`;
      exercise += `• 爬行训练：创造动机、设置目标\n`;
      exercise += `• 站立准备：扶站练习、腿部力量\n`;
      exercise += `• 精细动作：拇指对指、双手协调\n`;
      exercise += `• 平衡发展：坐位取物、姿势转换\n\n`;
      break;
    case 'toddler':
      exercise += `#运动能力提升（${age}个月）\n`;
      exercise += `• 步行练习：独立行走、变换方向\n`;
      exercise += `• 跑跳动作：原地跳跃、小跑步\n`;
      exercise += `• 球类游戏：滚球、踢球、投掷\n`;
      exercise += `• 攀爬活动：安全爬高、钻爬游戏\n\n`;
      break;
    default:
      exercise += `#综合运动能力（${age}个月）\n`;
      exercise += `• 复杂动作：单脚站立、倒退走\n`;
      exercise += `• 技能组合：跑跳结合、多步骤动作\n`;
      exercise += `• 器械运动：滑梯、秋千、平衡木\n`;
      exercise += `• 团体游戏：追逐游戏、模仿操\n\n`;
  }
  
  // 性别化运动建议
  if (gender === 'male') {
    exercise += `#男宝运动特色\n`;
    exercise += `• 力量训练：推拉玩具、攀爬活动\n`;
    exercise += `• 空间运动：投掷、踢球、跳跃\n`;
    exercise += `• 冒险精神：适度挑战、探索新环境\n\n`;
  } else {
    exercise += `#女宝运动特色\n`;
    exercise += `• 协调性：舞蹈动作、韵律活动\n`;
    exercise += `• 精确性：精细动作、平衡训练\n`;
    exercise += `• 美感训练：优美姿态、表达性动作\n\n`;
  }
  
  // 安全提醒
  exercise += `#运动安全\n`;
  exercise += `• 环境检查：确保活动区域安全无害\n`;
  exercise += `• 适度原则：观察疲劳信号，及时休息\n`;
  exercise += `• 循序渐进：从简单到复杂，逐步提升\n`;
  exercise += `• 陪伴监护：始终有成人在旁保护\n\n`;
  
  return exercise;
}

// 本地生成建议的函数（用于静态导出，保持向后兼容）
function generateRecommendationsByAge(age: number): RecommendationType {
  // 为了向后兼容，保留原有的简单逻辑作为备用
  const basicData: BabyData = {
    age,
    gender: 'male',
    weight: age * 0.5 + 3.5,
    height: age * 2 + 50,
    feedingMethod: 'mixed',
    sleepHours: age < 6 ? 16 : age < 12 ? 14 : 13,
    healthConditions: '',
    allergies: '',
    notes: ''
  };
  
  return generatePersonalizedRecommendations(basicData);
}

export async function generateRecommendations(data: BabyData): Promise<RecommendationType> {
  // 在静态导出环境中，直接使用智能个性化函数
  if (typeof window !== 'undefined') {
    // 客户端环境，模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 1000));
    return generatePersonalizedRecommendations(data);
  }
  
  // 服务器端环境（开发时）
  try {
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // 如果API调用失败，回退到本地智能函数
    console.warn('API call failed, using local intelligent function:', error);
    return generatePersonalizedRecommendations(data);
  }
}