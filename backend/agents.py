"""
AI 剪辑智能体系统（智能路由版）
支持灵活对话和自动意图识别
"""

from openai import OpenAI
from typing import Dict, List, Any, Optional
import json

# OpenAI 客户端配置
client = OpenAI(
    api_key="sk-JiDUxeYDc9EnJ5Gmni1tYOvucP8o8WNmY78dvnV8lQq0wKW7",
    base_url="https://yunwu.ai/v1"
)

# 短剧数据（包含图片路径）
DRAMA_DATA = [
    {
        "id": 1,
        "title": "霸道总裁的替身新娘",
        "views": "8500万",
        "score": 95,
        "description": "灰姑娘被迫替嫁霸总,却意外获得真爱",
        "tags": ["霸总", "甜宠", "替嫁"],
        "image": "/handsome-ceo-in-suit-office-background.jpg"
    },
    {
        "id": 2,
        "title": "重生之豪门千金归来",
        "views": "7200万",
        "score": 92,
        "description": "豪门千金重生复仇,智斗渣男白莲花",
        "tags": ["重生", "复仇", "豪门"],
        "image": "/luxury-mansion-wealthy-family-drama-scene.jpg"
    },
    {
        "id": 3,
        "title": "闪婚后被大佬宠上天",
        "views": "6800万",
        "score": 89,
        "description": "契约婚姻变真爱,大佬日常宠妻",
        "tags": ["闪婚", "宠文", "大佬"],
        "image": "/handsome-ceo-in-suit-office-background.jpg"
    },
    {
        "id": 4,
        "title": "穿越成恶毒女配怎么办",
        "views": "5600万",
        "score": 85,
        "description": "穿越成恶毒女配,改写命运逆袭人生",
        "tags": ["穿越", "逆袭", "女配"],
        "image": "/modern-city-with-mystical-elements-urban-fantasy.jpg"
    },
    {
        "id": 5,
        "title": "全能大佬她马甲掉了",
        "views": "5200万",
        "score": 83,
        "description": "隐藏身份的大佬马甲一个个掉落",
        "tags": ["马甲", "大佬", "打脸"],
        "image": "/detective-mystery-dark-atmosphere-crime-scene.jpg"
    },
    {
        "id": 6,
        "title": "校园甜心的逆袭之路",
        "views": "4800万",
        "score": 80,
        "description": "校园学霸与学渣的甜蜜恋爱故事",
        "tags": ["校园", "甜宠", "逆袭"],
        "image": "/young-students-in-school-uniform-campus-romance.jpg"
    },
    {
        "id": 7,
        "title": "宫廷秘史之皇后传",
        "views": "4500万",
        "score": 78,
        "description": "古代宫廷权谋,皇后的崛起之路",
        "tags": ["古装", "宫斗", "权谋"],
        "image": "/beautiful-princess-in-ancient-chinese-dress-palace.jpg"
    }
]


class BaseAgent:
    """基础智能体类"""

    def __init__(self, name: str, system_message: str):
        self.name = name
        self.system_message = system_message

    def chat(self, user_message: str, context: str = "") -> str:
        """与智能体对话"""
        try:
            messages = [{"role": "system", "content": self.system_message}]
            if context:
                messages.append({"role": "system", "content": f"上下文信息：{context}"})
            messages.append({"role": "user", "content": user_message})

            response = client.chat.completions.create(
                model="gpt-4o",
                messages=messages,
                temperature=0.7,
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"抱歉，发生错误: {str(e)}"


class IntentRouter(BaseAgent):
    """意图路由器 - 智能识别用户意图"""

    def __init__(self):
        super().__init__(
            name="意图路由器",
            system_message="""你是一个智能意图识别系统，负责理解用户的意图并路由到合适的智能体。

你需要识别以下意图类型：

1. **query_ranking** - 查询短剧日榜
   - 关键词：日榜、榜单、热门、推荐、什么短剧
   - 示例："给我看看今天的短剧日榜"

2. **select_drama** - 选择短剧进行推广
   - 关键词：想推广、选择、这个短剧
   - 示例："我想推广《霸道总裁的替身新娘》"

3. **consult_platform** - 咨询平台推广建议
   - 关键词：哪个平台、推广平台、适合什么平台
   - 示例："这个短剧适合哪些平台？"

4. **select_platform** - 选择推广平台
   - 关键词：TikTok、Facebook、Instagram、X、Twitter、抖音
   - 示例："我要推广到 TikTok 和 Instagram"

5. **create_script** - 请求创作脚本
   - 关键词：脚本、文案、创作、写
   - 示例："帮我写一个推广脚本"

6. **review_script** - 审核或修改脚本
   - 关键词：修改、调整、改、不太好
   - 示例："把开头改得更有悬念"

7. **confirm_script** - 确认脚本，准备剪辑
   - 关键词：可以、确认、满意、很好、没问题、开始剪辑
   - 示例："脚本很好，可以开始剪辑了"

8. **request_editing** - 请求视频剪辑
   - 关键词：剪辑、制作视频、开始做
   - 示例："开始剪辑吧"

9. **general_question** - 一般性问题或闲聊
   - 不属于以上任何类别的问题
   - 示例："今天天气怎么样？"、"你是谁？"

请以 JSON 格式返回识别结果：
{
    "intent": "意图类型",
    "confidence": 0.0-1.0,
    "entities": {
        "drama_name": "短剧名称（如果有）",
        "platforms": ["平台列表"],
        "other": "其他提取的信息"
    },
    "reasoning": "识别原因"
}"""
        )

    def identify_intent(self, user_message: str, context: str = "") -> Dict:
        """识别用户意图"""
        try:
            response = self.chat(user_message, context)
            # 尝试解析 JSON
            # 找到 JSON 部分
            start = response.find('{')
            end = response.rfind('}') + 1
            if start != -1 and end > start:
                json_str = response[start:end]
                return json.loads(json_str)
            else:
                # 如果没有 JSON，返回默认
                return {
                    "intent": "general_question",
                    "confidence": 0.5,
                    "entities": {},
                    "reasoning": "无法解析意图"
                }
        except Exception as e:
            return {
                "intent": "general_question",
                "confidence": 0.3,
                "entities": {},
                "reasoning": f"解析错误: {str(e)}"
            }


class ShortDramaRankingAgent(BaseAgent):
    """短剧日榜查询智能体"""

    def __init__(self):
        super().__init__(
            name="短剧榜单助手",
            system_message="""你是一个短剧数据分析专家，专门负责提供短剧日榜信息。
当用户查询排行榜时，请简单介绍榜单即可，不需要列出详细信息。
例如："为您展示今日短剧热门榜，请查看下方的精美卡片展示！"

如果用户问其他问题（不是关于日榜的），也要礼貌回答，并提醒可以查询日榜。
请用中文回答，态度专业且热情。

重要：请使用纯文本格式回答，不要使用Markdown语法（如#、**、-等）。使用表情符号和换行来组织内容。"""
        )

    def get_ranking_data(self) -> List[Dict]:
        """获取榜单数据（带图片）"""
        return DRAMA_DATA


class PlatformConsultantAgent(BaseAgent):
    """平台推广顾问智能体"""

    def __init__(self):
        super().__init__(
            name="平台推广顾问",
            system_message="""你是一个社交媒体平台推广专家。

可选平台包括：

📱 TikTok (抖音国际版)
- 用户群体：18-34岁年轻用户为主
- 内容特点：短视频、快节奏剪辑、强节奏感
- 推广优势：传播速度快，易形成病毒式传播
- 最佳视频时长：15-60秒

📘 Facebook
- 用户群体：25-54岁，覆盖面广
- 内容特点：中长视频、故事性强、注重分享
- 推广优势：用户基数大，适合深度内容
- 最佳视频时长：1-3分钟

📸 Instagram
- 用户群体：18-34岁，注重视觉美学
- 内容特点：精美画面、时尚感、视觉冲击
- 推广优势：品牌塑造能力强，互动率高
- 最佳视频时长：30-90秒

🐦 X (Twitter)
- 用户群体：新闻关注者、话题讨论者
- 内容特点：短片段、强话题性、易引发讨论
- 推广优势：话题传播快，舆论影响力大
- 最佳视频时长：10-45秒

你可以：
1. 根据短剧内容推荐最适合的平台
2. 回答平台相关的任何问题
3. 给出专业的推广建议
4. 询问用户想要选择哪些平台

用中文回答，保持专业和建议性的语气。

重要：请使用纯文本格式回答，不要使用Markdown语法（如#、**、-等）。使用表情符号和换行来组织内容。"""
        )


class ScriptMasterAgent(BaseAgent):
    """短剧脚本大师智能体"""

    def __init__(self):
        super().__init__(
            name="脚本创作大师",
            system_message="""你是一个顶级的短视频脚本创作专家，精通各大社交媒体平台的内容特点。

根据不同平台的特性创作脚本：

TikTok 脚本风格：
🎯 开头3秒必须抓眼球（悬念、冲突、反转）
⚡ 节奏快，15-60秒完整故事
💬 多用字幕和音效
❤️ 强调视觉冲击和情绪共鸣
🎵 配合热门音乐

Facebook 脚本风格：
📖 可以较长（1-3分钟）
💫 注重故事完整性和情感渲染
🎙️ 适合添加旁白解说
🔄 强调分享价值和讨论性

Instagram 脚本风格：
🎨 画面美学优先
🌈 强调视觉风格统一
⏱️ 30-90秒精华剪辑
🎶 配合流行音乐
✨ 注重品牌调性

X (Twitter) 脚本风格：
⚡ 超短精华（10-30秒）
💥 强冲突、强话题性
💬 适合引发讨论和转发
📝 文字配合视频

脚本应包括：
1. 开场钩子（前3秒，抓住注意力）
2. 核心内容（故事精华，展现亮点）
3. 情感高潮（打动用户的关键时刻）
4. 结尾引导（引导关��/分享/完整观看）
5. 文案建议（标题、描述、标签）
6. 音乐/音效建议

你可以：
1. 根据短剧和平台创作脚本
2. 修改和优化脚本
3. 回答脚本相关的问题
4. 给出创作建议

用中文回答，展现专业和创意。

重要：请使用纯文本格式回答，不要使用Markdown语法（如#、**、-等）。使用表情符号和换行来组织内容。"""
        )


class VideoEditorAgent(BaseAgent):
    """视频剪辑师智能体（模拟）"""

    def __init__(self):
        super().__init__(
            name="视频剪辑师",
            system_message="""你是一个专业的视频剪辑师。

剪辑工作流程：

📁 第一阶段：素材准备（预计10分钟）
- 素材整理和分类
- 标记关键片段
- 准备配乐和音效素材

✂️ 第二阶段：粗剪（预计30分钟）
- 按脚���顺序剪辑片段
- 初步控制时长
- 添加基础转场

🎨 第三阶段：精剪与特效（预计45分钟）
- 精确调整节奏和时长
- 添加转场特效
- 视频调色和画面美化
- 添加视觉特效

🎵 第四阶段：音频处理（预计20分钟）
- 添加背景音乐
- 调整音效和音量
- 音频混音和降噪

💬 第五阶段：字幕与包装（预计15分钟）
- 添加字幕和文案
- 添加片头片尾
- Logo 和品牌元素

🎯 第六阶段：最终渲染（预计10分钟）
- 预览和最终调整
- 导出高质量视频
- 生成不同平台所需格式

你可以：
1. 提供详细的剪辑方案和时间线
2. 说明剪辑的技术细节
3. 回答剪辑相关的问题
4. 根据要求调整剪辑方案

以专业且清晰的方式说明剪辑过程。用中文回答。

重要：请使用纯文本格式回答，不要使用Markdown语法（如#、**、-等）。使用表情符号和换行来组织内容。"""
        )


class GeneralAssistantAgent(BaseAgent):
    """通用助手 - 处理一般性问题"""

    def __init__(self):
        super().__init__(
            name="通用助手",
            system_message="""你是一个友好的 AI 助手，负责处理一般性问题和闲聊。

当用户问一些不在主要工作流程中的问题时，你要：
1. 礼貌且友好地回答
2. 如果合适，引导用户回到短剧推广的主题
3. 保持专业但不失亲和力

你知道这个系统的功能：
- 查询短剧日榜
- 选择短剧进行推广
- 推荐推广平台
- 创作推广脚本
- 提供视频剪辑方案

如果用户的问题与这些功能相关，可以引导他们使用相应功能。
用中文回答，保持友好和专业。

重要：请使用纯文本格式回答，不要使用Markdown语法（如#、**、-等）。使用表情符号和换行来组织内容。"""
        )


class AIVideoEditorSystem:
    """AI 视频剪辑智能体系统（智能路由版）"""

    def __init__(self):
        # 创建各个智能体
        self.intent_router = IntentRouter()
        self.ranking_agent = ShortDramaRankingAgent()
        self.platform_agent = PlatformConsultantAgent()
        self.script_agent = ScriptMasterAgent()
        self.editor_agent = VideoEditorAgent()
        self.general_agent = GeneralAssistantAgent()

        self.conversation_history = []

    def chat_with_agent(self, agent: BaseAgent, message: str, context: str = "") -> str:
        """与指定智能体对话"""
        response = agent.chat(message, context)

        # 记录对话历史
        self.conversation_history.append({
            "agent": agent.name,
            "user_message": message,
            "agent_response": response
        })

        return response

    def get_conversation_history(self) -> List[Dict[str, Any]]:
        """获取对话历史"""
        return self.conversation_history

    def clear_history(self):
        """清空对话历史"""
        self.conversation_history = []


class SmartWorkflowController:
    """智能工作��程控制器 - 支持灵活对话和自动路由"""

    def __init__(self):
        self.system = AIVideoEditorSystem()

        # 工作流状态
        self.workflow_state = {
            "current_step": "init",  # init, drama_selected, platform_selected, script_created, editing, completed
            "selected_drama": None,
            "selected_platforms": [],
            "script": None,
            "in_workflow": False  # 是否在工作流中
        }

    def _build_context(self) -> str:
        """构建上下文信息"""
        context_parts = []

        if self.workflow_state["selected_drama"]:
            context_parts.append(f"已选择的短剧：《{self.workflow_state['selected_drama']}》")

        if self.workflow_state["selected_platforms"]:
            platforms_str = "、".join(self.workflow_state["selected_platforms"])
            context_parts.append(f"已选择的平台：{platforms_str}")

        if self.workflow_state["script"]:
            context_parts.append("已创作脚本")

        context_parts.append(f"当前步骤：{self.workflow_state['current_step']}")

        return " | ".join(context_parts) if context_parts else "无上下文"

    def process_message(self, user_message: str) -> tuple[str, str, Optional[List[Dict]]]:
        """
        智能处理用户消息
        返回: (response_text, current_agent_name, ranking_data)
        """
        # 1. 识别用户意图
        context = self._build_context()
        intent_result = self.system.intent_router.identify_intent(user_message, context)
        intent = intent_result.get("intent", "general_question")
        entities = intent_result.get("entities", {})

        print(f"[DEBUG] 识别意图: {intent}, 实体: {entities}")  # 调试信息

        # 2. 根据意图路由到相应的智能体

        # 查询日榜
        if intent == "query_ranking":
            response = self.system.chat_with_agent(
                self.system.ranking_agent,
                user_message,
                context
            )
            self.workflow_state["in_workflow"] = True
            # 返回榜单数据
            ranking_data = self.system.ranking_agent.get_ranking_data()
            return response, "短剧榜单助手", ranking_data

        # 选择短剧
        elif intent == "select_drama":
            # 提取短剧名称
            drama_name = entities.get("drama_name") or user_message
            self.workflow_state["selected_drama"] = drama_name
            self.workflow_state["current_step"] = "drama_selected"
            self.workflow_state["in_workflow"] = True

            response = self.system.chat_with_agent(
                self.system.platform_agent,
                f"用户选择了短剧：{drama_name}，请询问用户想要推广到哪些平台，并给出专业建议。",
                context
            )
            return response, "平台推广顾问", None

        # 咨询平台建议
        elif intent == "consult_platform":
            response = self.system.chat_with_agent(
                self.system.platform_agent,
                user_message,
                context
            )
            return response, "平台推广顾问", None

        # 选择平台
        elif intent == "select_platform":
            platforms = entities.get("platforms", [])
            if not platforms:
                # 从用户消息中提取平台
                platforms = self._extract_platforms(user_message)

            self.workflow_state["selected_platforms"] = platforms
            self.workflow_state["current_step"] = "platform_selected"

            # 自动触发脚本创作
            if self.workflow_state["selected_drama"]:
                platforms_str = "、".join(platforms)
                response = self.system.chat_with_agent(
                    self.system.script_agent,
                    f"请为短剧《{self.workflow_state['selected_drama']}》创作适合 {platforms_str} 平台的推广脚本。请创作一个完整、专业、有创意的脚本。",
                    context
                )
                self.workflow_state["current_step"] = "script_created"
                return response, "脚本创作大师", None
            else:
                response = self.system.chat_with_agent(
                    self.system.platform_agent,
                    f"用户选择了平台：{user_message}。请确认并询问要推广哪个短剧。",
                    context
                )
                return response, "平台推广顾问", None

        # 创作脚本请求
        elif intent == "create_script":
            if self.workflow_state["selected_drama"] and self.workflow_state["selected_platforms"]:
                platforms_str = "、".join(self.workflow_state["selected_platforms"])
                response = self.system.chat_with_agent(
                    self.system.script_agent,
                    f"请为短剧《{self.workflow_state['selected_drama']}》创作适合 {platforms_str} 平台的推广脚本。",
                    context
                )
                self.workflow_state["current_step"] = "script_created"
                return response, "脚本创作大师", None
            else:
                response = self.system.chat_with_agent(
                    self.system.script_agent,
                    user_message,
                    context + " | 注意：用户尚未选择短剧或平台，请询问相关信息"
                )
                return response, "脚本创作大师", None

        # 审核或修改脚本
        elif intent == "review_script":
            response = self.system.chat_with_agent(
                self.system.script_agent,
                f"用户的修改意见：{user_message}。请根据意见修改脚本。",
                context
            )
            return response, "脚本创作大师", None

        # 确认脚本，开始剪辑
        elif intent == "confirm_script":
            self.workflow_state["script"] = "已确认"
            self.workflow_state["current_step"] = "editing"

            response = self.system.chat_with_agent(
                self.system.editor_agent,
                f"用户已确认脚本。请开始为短剧《{self.workflow_state['selected_drama']}》制作推广视频，目标平台：{', '.join(self.workflow_state['selected_platforms'])}。请提供详细的剪辑方案。",
                context
            )
            return response, "视频剪辑师", None

        # 请求剪辑
        elif intent == "request_editing":
            if self.workflow_state["script"]:
                response = self.system.chat_with_agent(
                    self.system.editor_agent,
                    user_message,
                    context
                )
                self.workflow_state["current_step"] = "editing"
                return response, "视频剪辑师", None
            else:
                response = self.system.chat_with_agent(
                    self.system.editor_agent,
                    user_message,
                    context + " | 注意：用户尚未确认脚本，请先询问脚本情况"
                )
                return response, "视频剪辑师", None

        # 一般性问题或闲聊
        else:
            response = self.system.chat_with_agent(
                self.system.general_agent,
                user_message,
                context
            )
            return response, "通用助手", None

    def _extract_platforms(self, message: str) -> List[str]:
        """从消息中提取平台名称"""
        platforms = []
        platform_keywords = {
            "tiktok": "TikTok",
            "抖音": "TikTok",
            "facebook": "Facebook",
            "fb": "Facebook",
            "instagram": "Instagram",
            "ins": "Instagram",
            "twitter": "X (Twitter)",
            "x": "X (Twitter)",
        }

        message_lower = message.lower()
        for keyword, platform_name in platform_keywords.items():
            if keyword in message_lower and platform_name not in platforms:
                platforms.append(platform_name)

        return platforms

    def get_current_step(self) -> str:
        """获取当前步骤"""
        return self.workflow_state["current_step"]

    def get_workflow_state(self) -> Dict:
        """获取工作流状态"""
        return self.workflow_state.copy()

    def reset(self):
        """重置工作流"""
        self.workflow_state = {
            "current_step": "init",
            "selected_drama": None,
            "selected_platforms": [],
            "script": None,
            "in_workflow": False
        }
        self.system.clear_history()
