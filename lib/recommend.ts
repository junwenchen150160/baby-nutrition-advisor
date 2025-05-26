// 宝宝营养推荐系统 - 纯静态版本
export interface RecommendationResult {
  question: string;
  answer: string;
  category: string;
  tips: string[];
  relatedQuestions: string[];
}

// 关键词匹配规则
const KEYWORD_RULES = {
  // 年龄相关
  age: {
    keywords: ['几个月', '个月', '岁', '年龄', '多大', '新生儿', '婴儿', '幼儿'],
    responses: {
      '0-6个月': {
        category: '新生儿期',
        answer: '0-6个月的宝宝主要以母乳或配方奶为主。6个月前不建议添加任何辅食，母乳是最佳营养来源。',
        tips: ['坚持母乳喂养', '按需喂养', '注意宝宝饱腹信号', '保持充足睡眠'],
        related: ['什么时候开始添加辅食？', '母乳不够怎么办？', '如何判断宝宝吃饱了？']
      },
      '6-12个月': {
        category: '辅食初期',
        answer: '6-12个月是辅食添加的关键期。从单一食材开始，逐步增加种类。首选强化铁米粉，然后是蔬菜泥、水果泥。',
        tips: ['一次只添加一种新食物', '观察3-5天确认无过敏', '质地从稀到稠', '保持母乳或配方奶'],
        related: ['宝宝不爱吃辅食怎么办？', '如何制作蔬菜泥？', '什么食物容易过敏？']
      },
      '1-2岁': {
        category: '幼儿期',
        answer: '1-2岁宝宝可以尝试更多家庭食物。注意营养均衡，包括谷物、蛋白质、蔬菜、水果和奶制品。',
        tips: ['培养自主进食能力', '少盐少糖', '避免坚果等容易窒息的食物', '规律进餐时间'],
        related: ['如何培养宝宝吃饭习惯？', '宝宝挑食怎么办？', '一岁后还需要喂奶吗？']
      }
    }
  },
  
  // 食物相关
  food: {
    keywords: ['吃什么', '食物', '辅食', '营养', '喂养', '饮食', '米粉', '蔬菜', '水果', '肉类'],
    responses: {
      '辅食添加': {
        category: '营养指导',
        answer: '辅食添加要遵循由少到多、由稀到稠、由细到粗的原则。首选强化铁米粉，再逐步添加蔬菜泥、水果泥、肉泥等。',
        tips: ['每次只添加一种新食物', '观察宝宝接受度', '保持食物新鲜', '注意食物安全'],
        related: ['宝宝几个月开始吃辅食？', '如何制作营养均衡的辅食？', '宝宝过敏了怎么办？']
      },
      '营养搭配': {
        category: '营养指导',
        answer: '宝宝需要均衡营养：碳水化合物提供能量，蛋白质促进生长，维生素和矿物质支持发育。每餐都要包含不同营养素。',
        tips: ['谷物类：米粉、面条、软饭', '蛋白质：蛋黄、鱼肉、豆腐', '蔬果类：应季蔬菜水果', '奶制品：母乳或配方奶'],
        related: ['如何搭配营养均衡的一餐？', '宝宝需要补充维生素吗？', '什么食物含铁量高？']
      }
    }
  },
  
  // 健康相关
  health: {
    keywords: ['过敏', '便秘', '腹泻', '感冒', '发烧', '湿疹', '消化', '免疫', '健康'],
    responses: {
      '过敏预防': {
        category: '健康管理',
        answer: '预防食物过敏要循序渐进添加辅食。常见过敏食物包括鸡蛋、牛奶、坚果、海鲜等，要谨慎添加并观察反应。',
        tips: ['延迟添加高过敏食物', '一次只试一种新食物', '观察皮肤、消化道反应', '有过敏史及时就医'],
        related: ['宝宝食物过敏有什么症状？', '如何处理过敏反应？', '过敏体质如何添加辅食？']
      },
      '消化问题': {
        category: '健康管理',
        answer: '宝宝消化系统发育不完善，容易出现便秘、腹泻等问题。注意饮食清淡，适量添加纤维素，保持充足水分。',
        tips: ['多吃富含纤维的蔬菜', '保证充足水分摄入', '适量运动促进肠胃蠕动', '规律作息'],
        related: ['宝宝便秘吃什么好？', '如何预防宝宝腹泻？', '什么情况需要看医生？']
      }
    }
  },
  
  // 发育相关
  development: {
    keywords: ['发育', '成长', '身高', '体重', '智力', '大脑', '骨骼', '牙齿'],
    responses: {
      '生长发育': {
        category: '发育指导',
        answer: '宝宝的生长发育需要充足的营养支持。蛋白质促进身高增长，钙质强健骨骼，DHA支持大脑发育。',
        tips: ['保证优质蛋白摄入', '补充钙质和维生素D', '适量摄入DHA', '规律体检监测发育'],
        related: ['如何促进宝宝身高增长？', '宝宝需要补钙吗？', '什么食物对大脑发育好？']
      },
      '智力发育': {
        category: '发育指导',
        answer: '大脑发育需要多种营养素：DHA促进神经发育，胆碱支持记忆力，铁质预防贫血影响智力发展。',
        tips: ['多吃深海鱼类', '适量坚果和种子', '绿叶蔬菜补充叶酸', '避免过度加工食品'],
        related: ['什么营养素对智力发育最重要？', '如何通过饮食提高宝宝智力？', '宝宝多大可以吃坚果？']
      }
    }
  }
};

// 默认回复
const DEFAULT_RESPONSES = [
  {
    category: '通用建议',
    answer: '宝宝的营养需求因年龄而异。建议根据宝宝的具体月龄，合理安排饮食。如有特殊情况，请咨询儿科医生。',
    tips: ['关注宝宝的生长曲线', '保持饮食多样化', '注意食物安全卫生', '定期儿保检查'],
    related: ['如何判断宝宝营养是否充足？', '宝宝不爱吃饭怎么办？', '什么时候需要看营养师？']
  },
  {
    category: '喂养指导',
    answer: '科学喂养要遵循宝宝的发育规律。母乳是最佳选择，辅食添加要循序渐进，培养良好的饮食习惯。',
    tips: ['坚持母乳喂养', '适时添加辅食', '培养自主进食', '营造良好进餐环境'],
    related: ['母乳喂养有什么好处？', '如何建立良好的进餐习惯？', '宝宝厌奶期怎么办？']
  }
];

// 智能关键词匹配函数
function matchKeywords(question: string): RecommendationResult {
  const questionLower = question.toLowerCase();
  
  // 年龄识别
  const ageMatch = questionLower.match(/(\d+)\s*(个月|月|岁)/);
  if (ageMatch) {
    const ageNum = parseInt(ageMatch[1]);
    const unit = ageMatch[2];
    
    let ageCategory = '';
    if (unit.includes('月')) {
      if (ageNum < 6) ageCategory = '0-6个月';
      else if (ageNum < 12) ageCategory = '6-12个月';
      else ageCategory = '1-2岁';
    } else if (unit.includes('岁')) {
      ageCategory = '1-2岁';
    }
    
    if (ageCategory && KEYWORD_RULES.age.responses[ageCategory as keyof typeof KEYWORD_RULES.age.responses]) {
      const response = KEYWORD_RULES.age.responses[ageCategory as keyof typeof KEYWORD_RULES.age.responses];
      return {
        question,
        answer: response.answer,
        category: response.category,
        tips: response.tips,
        relatedQuestions: response.related
      };
    }
  }
  
  // 关键词匹配
  for (const [category, rule] of Object.entries(KEYWORD_RULES)) {
    for (const keyword of rule.keywords) {
      if (questionLower.includes(keyword)) {
        const responses = Object.values(rule.responses);
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        return {
          question,
          answer: randomResponse.answer,
          category: randomResponse.category,
          tips: randomResponse.tips,
          relatedQuestions: randomResponse.related
        };
      }
    }
  }
  
  // 默认回复
  const randomDefault = DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
  return {
    question,
    answer: randomDefault.answer,
    category: randomDefault.category,
    tips: randomDefault.tips,
    relatedQuestions: randomDefault.related
  };
}

// 主要推荐函数
export function generateRecommendation(question: string): Promise<RecommendationResult> {
  return new Promise((resolve) => {
    // 模拟API延迟
    setTimeout(() => {
      const result = matchKeywords(question.trim());
      resolve(result);
    }, 500);
  });
}

// 获取热门问题
export function getPopularQuestions(): string[] {
  return [
    '6个月宝宝可以吃什么辅食？',
    '1岁宝宝营养搭配建议',
    '宝宝过敏了怎么办？',
    '如何预防宝宝便秘？',
    '什么食物对大脑发育好？',
    '宝宝不爱吃饭怎么办？',
    '如何给宝宝补钙？',
    '新生儿喂养注意事项'
  ];
} 