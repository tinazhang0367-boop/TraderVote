# TraderVote 网站项目关键信息总览

更新时间：2026-07-03

## 1. 项目定位

TraderVote 是面向交易者和投资者的金融服务评价与可信度诊断平台。当前第一阶段优先从 Broker 模块切入，先完成外汇与 CFD 经纪商的信息展示、评分、评论、监管检索、注册登录、基础后台和邮件验证，保证网站可以尽快上线运行。

长期方向是扩展为覆盖 Broker、Crypto Exchange、Fintech、Payment、Liquidity 的综合金融服务评价平台，并通过 AI Agent 进行新闻采集、博客撰写、评论整理、风险摘要和运营辅助。

## 2. 核心模块规划

### Broker

范围：外汇和 CFD 经纪商。

优先级：最高。

上线目标：先让用户可以浏览经纪商、查看评分、查看监管信息、提交评论、注册登录，并让后台可以审核评论和管理基础内容。

### Crypto Exchange

范围：数字货币交易所。

阶段：后续扩展。

### Fintech

范围：金融基础设施科技公司，例如 PrimeXM、Gold-i、MetaTrader 相关生态。

阶段：后续扩展。

### Payment

范围：交易者和投资者入金、出金相关的支付通道。

阶段：后续扩展。

### Liquidity

范围：服务机构交易者的流动性提供商。

阶段：后续扩展。

## 3. 当前产品策略

第一阶段不做复杂大而全功能，先去掉 Coming Soon 和暂时无法落地的模块，让网站简洁、轻便、可以快速上线。

当前重点：

- Broker 模块可用。
- 监管检索优先级高于语言切换。
- 首页突出智能化可信诊断，而不是堆砌介绍文字。
- 视觉参考 TradingView 的现代金融科技感，但避免过度复杂。
- 品牌名称使用 TraderVote。
- 首页 Banner 使用 AI 智能秘书方向，强调快速诊断和降低用户阅读评论成本。

## 4. 视觉与 UI 方向

### 品牌气质

关键词：可信、智能、现代、金融科技、简洁、有冲击力。

设计方向：

- 深色金融科技底色搭配清晰信息层级。
- 主页第一屏要有强识别度，但文字必须克制。
- 避免 Banner 左右割裂，视觉上要形成一个整体。
- 使用 AI 助手形象作为智能化差异点。
- Broker 卡片要避免过强金色背景影响五星评级识别。

### Logo

当前已替换全站 Logo，并在导航中使用 TraderVote 文字形式。

注意事项：

- 顶部导航 Logo 图标和文字需要保持比例协调。
- 不再使用全大写 TRADERVOTE。
- 优先使用 TraderVote。

### 评分颜色系统

目标：让用户快速识别经纪商评分风险。

建议规则：

- 4.5 星及以上：绿色，代表优秀和高可信。
- 4.0 到 4.49 星：蓝绿色，代表可靠。
- 3.0 到 3.99 星：黄色或琥珀色，代表中等，需要继续查看细节。
- 2.0 到 2.99 星：橙色，代表偏弱或有明显争议。
- 2.0 星以下：红色，代表高风险。

注意：评级颜色应该用于星级、评分标签和轻量状态提示，不应该被 Broker 卡片背景色覆盖。

## 5. 当前技术栈

前端框架：Nuxt 3

语言：TypeScript、Vue 3

国际化：Nuxt i18n

状态管理：Pinia

数据库：SQLite，本地开发使用 Prisma

邮件：Nodemailer + Zoho SMTP

当前本地预览地址：

http://localhost:3001/zh-CN

主要目录：

- pages：页面
- components：通用组件
- server/api：后端接口
- server/utils：后端工具函数
- prisma：数据库模型和种子数据
- public/images：品牌和首页图片资源
- utils/trust-score.ts：评分与可信度颜色逻辑

## 6. 已完成的上线基础版能力

### 页面

已存在的主要页面：

- 首页
- Broker 列表页
- Broker 详情页
- Broker 排行页
- 监管机构列表页
- 监管机构详情页
- 评论页
- 写评论页
- 博客页
- 博客详情页
- 登录页
- 注册页
- 邮箱验证页
- 管理后台页
- 关于、联系、隐私、条款、风险披露等基础页面

### 用户系统

已完成：

- 用户注册
- 用户登录
- 用户退出
- 当前用户信息获取
- Session 保存
- 邮箱验证 Token 创建
- 邮箱验证接口
- 重新发送验证邮件接口

### 管理后台

已完成基础后台：

- 数据概览
- Broker 管理列表
- 评论审核列表
- 文章列表
- 新闻列表
- AI 任务列表
- 邮件测试按钮

### 评论系统

已完成：

- 用户提交评论
- 评论默认进入 PENDING 状态
- 后台可审核评论
- 评论可关联 Broker
- 评论包含评分、正文、国家、经验等字段

### SEO 基础

已完成：

- robots.txt
- sitemap.xml
- 基础页面结构

## 7. 数据库模型

当前 Prisma 模型包括：

- User：用户
- Session：登录会话
- EmailVerificationToken：邮箱验证 Token
- Broker：经纪商
- Regulator：监管机构
- License：牌照和监管关系
- Review：用户评论
- Article：文章
- NewsItem：新闻
- AiTask：AI 任务记录

数据库当前为 SQLite，适合本地开发和第一阶段快速验证。正式上线时建议迁移到 PostgreSQL。

## 8. 邮箱配置状态

已在代码中接入 Zoho SMTP：

- 发件账号：info@tradervote.com
- 回复邮箱：support@tradervote.com
- SMTP Host：smtp.zoho.com
- SMTP Port：587
- SMTP Secure：false

注意：邮箱密码不应写入文档或代码仓库，只保存在本地 `.env` 或正式服务器的环境变量中。

当前测试结果：

SMTP 登录和发信已经测试成功。测试邮件已成功发送到 support@tradervote.com。

说明：smtppro.zoho.com 在当前账号上返回 554 5.7.8 Access Restricted，但 smtp.zoho.com 的 587/TLS 和 465/SSL 均可正常认证。当前项目已切换到 smtp.zoho.com。

已完成官方邮件模板：

- 注册邮箱验证邮件
- 找回密码邮件
- 后台测试邮件

邮件模板包含：

- TraderVote 品牌头部
- 内嵌 Logo
- 主操作按钮
- 安全提示
- 备用链接
- 官网地址
- support@tradervote.com 官方支持签名

已完成找回密码链路：

- 申请找回密码页面
- 设置新密码页面
- 密码重置 Token 数据表
- 申请找回密码接口
- 设置新密码接口
- 登录页忘记密码入口

## 9. 当前 API 能力

### Auth

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/logout
- POST /api/auth/verify-email
- POST /api/auth/resend-verification

### Broker

- GET /api/brokers
- GET /api/brokers/top
- GET /api/brokers/:slug
- GET /api/brokers/:slug/reviews

### Review

- POST /api/reviews
- GET /api/reviews/latest

### Admin

- GET /api/admin/summary
- GET /api/admin/brokers
- GET /api/admin/reviews
- PATCH /api/admin/reviews/:id
- GET /api/admin/articles
- GET /api/admin/news
- GET /api/admin/ai-tasks
- POST /api/admin/ai-tasks
- POST /api/admin/mail-test

### Content

- GET /api/blog/posts
- GET /api/blog/posts/:slug
- GET /api/regulators
- GET /api/countries
- GET /api/promotions

## 10. 本地账号和权限

本地开发环境已有管理员账号。

注意：管理员密码不应写入公开文档。需要交接时应通过安全渠道传递，正式上线前必须重新设置强密码，并启用更严格的后台登录保护。

## 11. 已验证事项

已验证：

- 注册流程可运行
- 登录流程可运行
- 后台概览接口可运行
- 评论提交可运行
- 评论审核可运行
- 邮箱验证代码链路已接入
- Typecheck 通过
- Build 通过

当前非阻塞提醒：

- 构建时存在 Nuxt i18n optimizeTranslationDirective 警告。
- 构建时存在 Prisma/Vue 相关 deprecation 警告。
- Windows 本地构建提示 Nuxt Image sharp 缺失警告。

这些警告暂不影响第一阶段上线验证。

## 12. 下一步开发计划

### 邮箱验证完善

优先级：高。

任务：

- 用真实注册流程测试邮箱验证链接。
- 用真实邮箱测试找回密码链接。
- 检查邮件是否进入垃圾箱。
- 正式上线前将 SMTP 环境变量同步到服务器。

### 第三方社交登录

优先级：中高。

建议优先：

- Google 登录
- Facebook 或 X 登录，根据目标市场选择

任务：

- 新增 OAuth Provider 配置。
- 新增社交账号绑定模型。
- 登录页增加社交登录按钮。
- 处理社交登录后的邮箱验证状态。

### 内容分享

优先级：中。

任务：

- Broker 详情页分享按钮。
- 评论分享。
- 文章分享。
- Open Graph 和 Twitter Card 优化。

### 正式数据库

优先级：高。

建议：

- 正式环境使用 PostgreSQL。
- 设置数据库备份策略。
- 管理后台操作记录后续加入 Audit Log。

### AI Agent 运营能力

优先级：中高。

建议先做：

- 新闻采集任务。
- Broker 风险摘要生成。
- 评论聚合摘要。
- 博客选题和草稿生成。
- 监管变化监测。

## 13. 上线前检查清单

上线前必须检查：

- 正式域名配置
- HTTPS
- 正式数据库
- 环境变量
- 邮箱发送
- 管理员密码
- robots.txt
- sitemap.xml
- 页面 Meta 信息
- Broker 核心数据
- 监管信息准确性
- 评论审核流程
- 错误页
- 移动端首页和 Broker 页
- 后台访问权限

## 14. AI Agent 接手说明

后续 AI Agent 接手时，应优先理解以下目标：

1. 当前第一阶段不是做完整金融生态平台，而是先把 Broker 模块上线。
2. 监管检索和可信评分是核心价值，语言切换不能抢主视觉。
3. 网站差异化重点是智能诊断，不只是评论列表。
4. 所有 Coming Soon 或无法上线的模块都应保持弱化或隐藏。
5. 邮箱、数据库、后台、评论审核是正式上线的基础设施。
6. 任何涉及密码、密钥、SMTP、OAuth Secret 的信息不得写入代码仓库或公开文档。
