// API服务 - 连接后端AutoGen智能体系统

// 支持从环境变量注入后端地址（Vercel/生产环境）
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ChatRequest {
  message: string;
  session_id?: string;
}

export interface ChatResponse {
  response: string;
  agent_name: string;
  workflow_state: {
    current_step: string;
    selected_drama: string | null;
    selected_platforms: string[];
    script: string | null;
    in_workflow: boolean;
  };
  current_step: string;
  ranking_data?: Array<{
    id: number;
    title: string;
    views: string;
    score: number;
    description: string;
    tags: string[];
    image: string;
  }>;
}

export class AIService {
  private sessionId: string;

  constructor(sessionId: string = 'default') {
    this.sessionId = sessionId;
  }

  // 发送消息给AI
  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          session_id: this.sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message to AI:', error);
      throw error;
    }
  }

  // 重置会话
  async resetSession(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/api/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: this.sessionId,
        }),
      });
    } catch (error) {
      console.error('Error resetting session:', error);
      throw error;
    }
  }

  // 获取工作流状态
  async getWorkflowState(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/workflow/${this.sessionId}`);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting workflow state:', error);
      throw error;
    }
  }

  // 检查后端健康状态
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }
}
