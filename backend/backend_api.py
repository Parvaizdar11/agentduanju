"""
AI 剪辑智能体系统 - FastAPI 后端服务
为前端提供 RESTful API
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import sys
import os

# 添加当前目录到模块路径
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)
from agents import SmartWorkflowController

app = FastAPI(
    title="AI 视频剪辑智能体 API",
    description="智能短剧推广助手后端服务",
    version="2.0.0"
)

# 配置 CORS - 添加Vite开发服务器端口
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:3001"],  # Vite默认5173端口
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 存储每个会话的控制器（简单实现，生产环境应使用 Redis）
sessions: Dict[str, SmartWorkflowController] = {}


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"


class ChatResponse(BaseModel):
    response: str
    agent_name: str
    workflow_state: Dict[str, Any]
    current_step: str
    ranking_data: Optional[List[Dict]] = None  # 新增：榜单数据


class SessionResetRequest(BaseModel):
    session_id: Optional[str] = "default"


def get_or_create_controller(session_id: str) -> SmartWorkflowController:
    """获取或创建会话控制器"""
    if session_id not in sessions:
        sessions[session_id] = SmartWorkflowController()
    return sessions[session_id]


@app.get("/")
async def root():
    """根路径"""
    return {
        "message": "AI 视频剪辑智能体 API",
        "version": "2.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "sessions": len(sessions)
    }


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    聊天接口

    接收用户消息，返回智能体响应
    """
    try:
        # 获取或创建控制器
        controller = get_or_create_controller(request.session_id)

        # 处理消息（现在返回3个值）
        response_text, agent_name, ranking_data = controller.process_message(request.message)

        # 获取工作流状态
        workflow_state = controller.get_workflow_state()
        current_step = controller.get_current_step()

        return ChatResponse(
            response=response_text,
            agent_name=agent_name,
            workflow_state=workflow_state,
            current_step=current_step,
            ranking_data=ranking_data
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/reset")
async def reset_session(request: SessionResetRequest):
    """
    重置会话

    清空指定会话的状态
    """
    try:
        session_id = request.session_id

        if session_id in sessions:
            sessions[session_id].reset()
            return {"message": f"Session {session_id} reset successfully"}
        else:
            return {"message": f"Session {session_id} not found, nothing to reset"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/workflow/{session_id}")
async def get_workflow_state(session_id: str = "default"):
    """
    获取工作流状态

    返回指定会话的当前工作流状态
    """
    try:
        controller = get_or_create_controller(session_id)

        return {
            "session_id": session_id,
            "workflow_state": controller.get_workflow_state(),
            "current_step": controller.get_current_step()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/agents")
async def get_agents_info():
    """
    获取智能体信息

    返回所有可用智能体的信息
    """
    return {
        "agents": [
            {
                "id": "intent_router",
                "name": "意图路由器",
                "icon": "🧠",
                "description": "智能识别用户意图"
            },
            {
                "id": "ranking_agent",
                "name": "短剧榜单助手",
                "icon": "📊",
                "description": "提供最新短剧热门榜单"
            },
            {
                "id": "platform_agent",
                "name": "平台推广顾问",
                "icon": "🌐",
                "description": "推荐最佳推广平台"
            },
            {
                "id": "script_agent",
                "name": "脚本创作大师",
                "icon": "✍️",
                "description": "创作平台定制化脚本"
            },
            {
                "id": "editor_agent",
                "name": "视频剪辑师",
                "icon": "🎥",
                "description": "专业视频剪辑制作"
            },
            {
                "id": "general_agent",
                "name": "通用助手",
                "icon": "💬",
                "description": "回答一般性问题"
            }
        ]
    }


if __name__ == "__main__":
    import uvicorn

    print("🚀 启动 AI 视频剪辑智能体后端服务...")
    print("📍 API 地址: http://localhost:8000")
    print("📚 API 文档: http://localhost:8000/docs")
    print("💡 健康检查: http://localhost:8000/health")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
