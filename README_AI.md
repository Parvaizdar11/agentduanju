# 短剧剪辑推广 - AI智能助手系统

这是一个集成了真实AutoGen AI智能体的短剧推广系统,提供完整的AI对话交互能力。

## 🌟 功能特点

- ✅ 真实AI智能体集成 (基于AutoGen和OpenAI)
- ✅ 智能对话与意图识别
- ✅ 短剧榜单查询
- ✅ 多平台推广方案生成
- ✅ 自动脚本创作
- ✅ 视频剪辑流程规划
- ✅ 精美的UI界面展示

## 🚀 快速启动

### 一键启动(推荐)

```bash
cd "/Users/ming/Desktop/短剧剪辑推广"
./start.sh
```

这个脚本会:
1. 自动安装所需依赖
2. 启动后端AI服务 (端口 8000)
3. 启动前端界面 (端口 5173)

### 手动启动

#### 1. 启动后端服务

```bash
# 安装Python依赖
cd backend
pip3 install -r requirements.txt

# 启动后端
python3 backend_api.py
```

后端服务将在 `http://localhost:8000` 启动

#### 2. 启动前端服务

```bash
# 在项目根目录
npm install
npm run dev
```

前端服务将在 `http://localhost:5173` 启动

## 📖 使用说明

1. 访问 `http://localhost:5173` 打开应用
2. 点击"开始创作"进入工作台
3. 与AI助手对话,例如:
   - "今日短剧日榜是什么?"
   - "我想推广《霸道总裁的替身新娘》"
   - "帮我生成TikTok和Instagram的推广脚本"

## 🏗️ 项目结构

```
短剧剪辑推广/
├── backend/                  # 后端AI服务
│   ├── agents.py            # AutoGen智能体系统
│   ├── backend_api.py       # FastAPI后端接口
│   └── requirements.txt     # Python依赖
├── src/                     # 前端源码
│   ├── components/          # React组件
│   ├── services/           # API服务
│   │   └── api.ts          # AI服务接口
│   └── ...
├── start.sh                 # 一键启动脚本
├── package.json            # 前端依赖
└── README.md               # 说明文档
```

## 🔧 技术栈

### 后端
- **FastAPI** - 高性能Web框架
- **OpenAI API** - AI大模型服务
- **Python 3.x** - 编程语言

### 前端
- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **Motion** - 动画库

## 🔑 环境配置

后端AI服务使用的API配置在 `backend/agents.py` 中:

```python
client = OpenAI(
    api_key="your-api-key",
    base_url="https://yunwu.ai/v1"
)
```

如需修改,请编辑该文件。

## 📡 API接口

后端提供以下API端点:

- `POST /api/chat` - 发送消息给AI
- `POST /api/reset` - 重置会话
- `GET /api/workflow/{session_id}` - 获取工作流状态
- `GET /api/agents` - 获取智能体信息
- `GET /health` - 健康检查

API文档: `http://localhost:8000/docs`

## 🤖 AI智能体

系统包含以下AI智能体:

1. **意图路由器** - 识别用户意图
2. **短剧榜单助手** - 提供热门榜单
3. **平台推广顾问** - 推荐推广平台
4. **脚本创作大师** - 创作推广脚本
5. **视频剪辑师** - 提供剪辑方案
6. **通用助手** - 回答一般问题

## 🐛 故障排查

### 后端无法启动
- 检查Python版本 (需要 3.8+)
- 检查依赖是否正确安装: `pip3 install -r backend/requirements.txt`
- 检查端口8000是否被占用

### 前端无法连接后端
- 确认后端服务已启动
- 检查浏览器控制台是否有CORS错误
- 确认API地址配置正确 (`src/services/api.ts`)

### AI响应错误
- 检查OpenAI API密钥是否有效
- 检查网络连接
- 查看后端日志: `backend/backend.log`

## 📝 更新日志

### v2.0.0 (2025-10-22)
- ✅ 集成真实AutoGen AI智能体
- ✅ 替换模拟对话为真实AI交互
- ✅ 添加后端健康检查
- ✅ 优化错误处理
- ✅ 添加一键启动脚本

### v1.0.0 (初始版本)
- ✅ 基础UI界面
- ✅ 模拟对话演示

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request!

---

Made with ❤️ by AI短剧推广团队
