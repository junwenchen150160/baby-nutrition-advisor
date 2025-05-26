# 宝宝今日吃啥 - 个性化育儿建议系统

一个基于AI的个性化宝宝育儿建议应用，为0-36个月的宝宝提供科学的辅食、互动、发展和运动建议。

## ✨ 功能特色

- 🍎 **科学辅食推荐** - 根据宝宝年龄、体重、过敏史等提供个性化辅食建议
- 👨‍👩‍👦 **亲子互动指导** - 适合不同月龄的亲子游戏和互动方式
- 🧠 **智力开发建议** - 促进宝宝认知发展的活动和玩具推荐
- 🏃 **运动锻炼指南** - 适合宝宝的运动和体能训练建议
- 📱 **响应式设计** - 支持手机、平板和桌面设备
- 💾 **本地存储** - 建议可保存和分享
- 🔒 **隐私保护** - 数据仅在本地存储，保护用户隐私

## 🛠️ 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI组件库**: Shadcn UI + Radix UI
- **样式**: Tailwind CSS
- **表单处理**: React Hook Form + Zod
- **AI服务**: OpenRouter API
- **语言**: TypeScript

## 📦 安装和运行

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd baby-recommendation-app
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **配置环境变量**
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，添加你的 OpenRouter API 密钥：
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
NEXT_PUBLIC_APP_NAME=宝宝今日吃啥
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

5. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 🚀 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量
4. 部署完成

### 其他平台

项目支持部署到任何支持 Next.js 的平台，如：
- Netlify
- Railway
- Heroku
- 自托管服务器

## 📖 使用指南

### 基本使用流程

1. **填写宝宝信息**
   - 年龄（0-36个月）
   - 性别
   - 体重和身高（可选）
   - 健康状况和过敏史
   - 喂养方式和睡眠时间

2. **生成建议**
   - 点击"生成建议"按钮
   - 系统将基于输入信息生成个性化建议

3. **查看结果**
   - 浏览四个类别的建议：辅食、互动、发展、运动
   - 可以分享或下载建议内容

### 高级功能

- **分享功能**: 支持原生分享API或复制到剪贴板
- **下载功能**: 将建议导出为文本文件
- **本地存储**: 建议自动保存，可随时查看

## 🔧 开发指南

### 项目结构

```
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   ├── recommender/       # 主要页面
│   └── results/           # 结果页面
├── components/            # React组件
│   ├── ui/               # UI基础组件
│   └── baby-input-form.tsx # 表单组件
├── lib/                   # 工具函数
│   ├── api.ts            # API调用
│   ├── types.ts          # 类型定义
│   └── utils.ts          # 工具函数
└── hooks/                 # 自定义Hooks
```

### 添加新功能

1. **新增表单字段**
   - 更新 `lib/types.ts` 中的类型定义
   - 修改 `components/baby-input-form.tsx` 添加表单字段
   - 更新 API 处理逻辑

2. **自定义建议模板**
   - 修改 `app/api/recommendations/route.ts` 中的提示词
   - 调整建议生成逻辑

3. **UI样式调整**
   - 使用 Tailwind CSS 类名
   - 遵循 Shadcn UI 设计规范

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 配置
- 使用函数式组件和 Hooks
- 优先使用服务端组件（RSC）

## 🔐 API配置

### OpenRouter API

1. 访问 [OpenRouter](https://openrouter.ai/) 注册账户
2. 获取 API 密钥
3. 在 `.env.local` 中配置密钥

### 自定义AI服务

如需使用其他AI服务，修改 `app/api/recommendations/route.ts` 中的API调用逻辑。

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React框架
- [Shadcn UI](https://ui.shadcn.com/) - UI组件库
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [OpenRouter](https://openrouter.ai/) - AI API服务

## 📞 支持

如有问题或建议，请：
- 创建 [Issue](../../issues)
- 发送邮件至 [your-email@example.com]
- 加入我们的社区讨论

---

**注意**: 本应用提供的建议仅供参考，不能替代专业医疗建议。如有健康问题，请咨询儿科医生。 