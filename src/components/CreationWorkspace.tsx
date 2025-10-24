import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Sparkles,
  Send,
  Bot,
  User,
  Maximize2,
  Minimize2,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  Paperclip,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { DramaRankingArtifact } from './artifacts/DramaRankingArtifact';
import { PlatformSelectorArtifact } from './artifacts/PlatformSelectorArtifact';
import { ScriptArtifact } from './artifacts/ScriptArtifact';
import { VideoEditingArtifact } from './artifacts/VideoEditingArtifact';
import { AIService } from '../services/api';

interface CreationWorkspaceProps {
  onBack: () => void;
  projectData?: any;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  agent?: string;
  timestamp: Date;
}

interface ArtifactData {
  type: 'drama-ranking' | 'platform-selector' | 'script' | 'video-editing' | null;
  data?: any;
}

const platforms = [
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'from-black to-cyan-500', description: '15-60秒短视频' },
  { id: 'facebook', name: 'Facebook', icon: '👥', color: 'from-blue-600 to-blue-700', description: '1-3分钟视频' },
  { id: 'instagram', name: 'Instagram', icon: '📸', color: 'from-purple-600 via-pink-600 to-orange-500', description: 'Reels 90秒以内' },
  { id: 'x', name: 'X (Twitter)', icon: '🐦', color: 'from-black to-gray-800', description: '2分钟视频' }
];

export function CreationWorkspace({ onBack, projectData }: CreationWorkspaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      agent: '北斗AI助手',
      content: '你好！我是北斗AI短剧推广助手。我可以帮你查看今日热门短剧排行榜，并协助你制作推广视频。\n\n请问需要我做什么？',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [artifact, setArtifact] = useState<ArtifactData>({ type: null });
  const [selectedDrama, setSelectedDrama] = useState<any>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isArtifactExpanded, setIsArtifactExpanded] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 初始化AI服务
  const aiService = useRef(new AIService('default')).current;

  // 检查后端健康状态
  useEffect(() => {
    const checkBackend = async () => {
      const isHealthy = await aiService.healthCheck();
      if (!isHealthy) {
        setBackendError('后端服务未启动，请先运行后端服务');
      } else {
        setBackendError(null);
      }
    };
    checkBackend();
  }, [aiService]);

  // 如果从首页带来初始消息，则自动发送一次
  useEffect(() => {
    const initial = projectData?.initialMessage as string | undefined;
    if (initial && initial.trim()) {
      // 直接添加用户消息到聊天记录
      addMessage({
        type: 'user',
        content: initial
      });
      
      // 然后发送给AI处理
      const sendInitialMessage = async () => {
        setIsTyping(true);
        try {
          const response = await aiService.sendMessage(initial);
          setIsTyping(false);
          addMessage({
            type: 'ai',
            content: response.response,
            agent: response.agent_name
          });
        } catch (error) {
          setIsTyping(false);
          addMessage({
            type: 'ai',
            content: '抱歉，处理您的消息时出现了错误。',
            agent: '系统'
          });
        }
      };
      
      sendInitialMessage();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // 平台ID归一化
  const normalizePlatformId = (id: string) => {
    const lower = (id || '').toLowerCase();
    const map: Record<string, string> = {
      douyin: 'tiktok',
      tiktok: 'tiktok',
      fb: 'facebook',
      facebook: 'facebook',
      ig: 'instagram',
      instagram: 'instagram',
      twitter: 'x',
      x: 'x',
    };
    return map[lower] || lower;
  };

  // 根据ID获取平台信息（未知则给安全默认值）
  const getPlatformInfo = (id: string) => {
    const normalized = normalizePlatformId(id);
    const found = platforms.find(p => p.id === normalized);
    return (
      found || {
        id: normalized,
        name: normalized,
        icon: '✨',
        color: 'from-gray-600 to-gray-700',
        description: ''
      }
    );
  };

  const sendMessageWithContent = async (messageContent: string) => {
    if (!messageContent.trim()) return;

    // 检查后端是否可用
    if (backendError) {
      alert('后端服务未启动，请先运行: python backend/backend_api.py');
      return;
    }

    // 添加用户消息
    addMessage({
      type: 'user',
      content: messageContent
    });
    setInputValue('');

    // 显示AI正在思考
    setIsTyping(true);

    try {
      // 调用真实的AI服务
      const response = await aiService.sendMessage(messageContent);
      // ... 其余逻辑保持不变
      setIsTyping(false);

      // 添加AI响应
      addMessage({
        type: 'ai',
        content: response.response,
        agent: response.agent_name
      });

      // 处理榜单数据等逻辑...
      const isRankingQuery = /排行|榜单|排行榜|热度|ranking|rank/i.test(messageContent);
      let handledByRanking = false;
      if (response.ranking_data && response.ranking_data.length > 0) {
        const transformedDramas = response.ranking_data.map((drama: any, index: number) => ({
          id: drama.id || index + 1,
          title: drama.title,
          category: drama.tags?.[0] || '短剧',
          thumbnail: drama.image || `https://images.unsplash.com/photo-1664714844985-adb4fd6572ec?w=400`,
          views: drama.views,
          likes: Math.floor(parseInt(drama.views.replace(/[^\d]/g, '')) / 10) + 'K',
          rank: index + 1,
          description: drama.description,
          episodes: 80,
          rating: drama.score / 10
        }));

        setArtifact({
          type: 'drama-ranking',
          data: { dramas: transformedDramas }
        });
        setCurrentStep(1);
        handledByRanking = true;
        // 如果用户明确查询排行榜，则以排行榜为主，不要被后续工作流覆盖
        if (isRankingQuery) {
          return;
        }
      }

      if (response.workflow_state?.selected_drama && !selectedDrama) {
        setSelectedDrama({ title: response.workflow_state.selected_drama });
        setCurrentStep(2);
        setTimeout(() => {
          setArtifact({
            type: 'platform-selector',
            data: {
              drama: { title: response.workflow_state.selected_drama },
              platforms
            }
          });
        }, 1000);
      }

      if ((response.workflow_state?.selected_platforms?.length || 0) > 0 && selectedPlatforms.length === 0) {
        const normalized = response.workflow_state!.selected_platforms.map(normalizePlatformId);
        setSelectedPlatforms(normalized);
        setCurrentStep(3);
      }

      if (!handledByRanking && response.current_step === 'script_created' && response.workflow_state?.selected_drama) {
        const ids = (response.workflow_state.selected_platforms || []).map(normalizePlatformId);
        const scripts = ids.map((platformId: string) =>
          generateScript({ title: response.workflow_state!.selected_drama }, platformId)
        );

        setTimeout(() => {
          setArtifact({
            type: 'script',
            data: {
              drama: { title: response.workflow_state.selected_drama },
              scripts,
              platforms: response.workflow_state.selected_platforms
            }
          });
        }, 1500);
      }

      if (!handledByRanking && response.current_step === 'editing') {
        setCurrentStep(4);
        setTimeout(() => {
          setArtifact({
            type: 'video-editing',
            data: {
              drama: selectedDrama,
              platforms: selectedPlatforms.map(id => getPlatformInfo(id))
            }
          });
        }, 1000);
      }

    } catch (error) {
      setIsTyping(false);
      console.error('Error communicating with AI:', error);
      addMessage({
        type: 'ai',
        content: `抱歉，与AI服务通信时出现错误。请确保后端服务正在运行。

错误详情: ${error instanceof Error ? error.message : '未知错误'}`,
        agent: '系统'
      });
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    await sendMessageWithContent(inputValue);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
    // 重置input value以允许上传相同文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSelectDrama = async (drama: any) => {
    setSelectedDrama(drama);
    setCurrentStep(2);

    const message = `我想选择《${drama.title}》这个短剧来做推广`;
    addMessage({
      type: 'user',
      content: message
    });

    setIsTyping(true);

    try {
      const response = await aiService.sendMessage(message);
      setIsTyping(false);

      addMessage({
        type: 'ai',
        content: response.response,
        agent: response.agent_name
      });

      setTimeout(() => {
        setArtifact({
          type: 'platform-selector',
          data: { drama, platforms }
        });
      }, 1000);

    } catch (error) {
      setIsTyping(false);
      console.error('Error:', error);
    }
  };

  const handleConfirmPlatforms = async (selectedPlatformIds: string[]) => {
    setSelectedPlatforms(selectedPlatformIds);
    setCurrentStep(3);
    const normalized = selectedPlatformIds.map(normalizePlatformId);
    const platformNames = normalized.map(id => getPlatformInfo(id).name).join('、');

    const message = `我选择推广到：${platformNames}`;
    addMessage({
      type: 'user',
      content: message
    });

    setIsTyping(true);

    try {
      const response = await aiService.sendMessage(message);
      setIsTyping(false);

      addMessage({
        type: 'ai',
        content: response.response,
        agent: response.agent_name
      });

      setTimeout(() => {
        const scripts = normalized.map(platformId => generateScript(selectedDrama, platformId));

        setArtifact({
          type: 'script',
          data: { drama: selectedDrama, scripts, platforms: normalized }
        });
      }, 2000);

    } catch (error) {
      setIsTyping(false);
      console.error('Error:', error);
    }
  };

  const generateScript = (drama: any, platformId: string) => {
    // 随机工具，用于生成不同版本脚本
    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

    const scriptTemplates: any = {
      tiktok: {
        duration: '15秒',
        hook: '前3秒爆点',
        hookContent: pick([
          '她被陷害流落街头，谁知路边救的老人竟是首富！#短剧 #短剧推荐',
          '开局就炸裂！一碗面改变她的人生，接下来更离谱… #爽剧',
          '三秒钟带你入坑：她救下的老人竟是财阀掌门人！#反转'
        ]),
        structure: [
          { time: '0-3秒', content: '女主落魄镜头 + 震撼文案', highlight: true },
          { time: '3-8秒', content: pick(['转折点剪辑（救人/相遇）', '冲突引爆：矛盾正面碰撞']) },
          { time: '8-12秒', content: '反转高潮画面' },
          { time: '12-15秒', content: '引导完整版观看' }
        ],
        tags: pick(['#短剧 #爽剧 #必看', '#短剧推荐 #反转 #高能', '#热门 #剧情反转']),
        music: pick(['节奏感强的热门BGM', '低频鼓点+电音氛围', '断点式节奏BGM']),
        tips: '抖音用户喜欢快节奏、强反转的内容，前3秒必须抓住眼球'
      },
      facebook: {
        duration: '60-90秒',
        hook: '故事引入',
        hookContent: pick([
          '一个精彩的故事，看到最后你会被震撼...',
          '她做了一次决定，彻底改变全家人的命运…',
          '完整故事线+强情绪，结尾的反转绝对出乎意料'
        ]),
        structure: [
          { time: '0-10秒', content: '背景介绍 + 人物设定' },
          { time: '10-40秒', content: pick(['冲突展开（3-4个关键转折点）', '推进主线：铺垫-冲突-升级']), highlight: true },
          { time: '40-70秒', content: '高潮片段串联' },
          { time: '70-90秒', content: '悬念结尾 + 完整版链接' }
        ],
        tags: pick(['精彩短剧分享', '今日追剧必看', '家庭/爱情/反转']),
        music: pick(['情感渲染BGM', '钢琴+弦乐情绪线', '暖色氛围BGM']),
        tips: 'Facebook用户更喜欢有完整故事线的内容，可以适当延长时长'
      },
      instagram: {
        duration: '30-60秒',
        hook: '视觉冲击',
        hookContent: pick([
          '绝美镜头语言讲述精彩故事',
          '胶片质感+慢镜头，氛围感拉满',
          '大片级配色，三秒抓住眼球'
        ]),
        structure: [
          { time: '0-5秒', content: '精美画面开场', highlight: true },
          { time: '5-25秒', content: pick(['快节奏剪辑（每3秒一个冲击点）', '镜头语言递进（特写-中景-远景）']) },
          { time: '25-50秒', content: '情感高潮' },
          { time: '50-60秒', content: 'CTA + Swipe Up' }
        ],
        tags: pick(['#短剧推荐 #Reels', '#影像 #氛围感', '#视觉大片']),
        music: pick(['流行热门音乐', '鼓点明快的电子乐', '氛围感流行']),
        tips: 'Instagram注重视觉美感，需要精美的画面和流畅的转场'
      },
      x: {
        duration: '45秒',
        hook: '话题性开场',
        hookContent: pick([
          '这部短剧火了！5分钟看完完整剧情走向',
          '热议话题：她的一句话引爆全网评论区',
          '三点总结剧情精华，一眼看爽点'
        ]),
        structure: [
          { time: '0-5秒', content: '话题引入', highlight: true },
          { time: '5-30秒', content: '快速剧情梗概（突出爽点）' },
          { time: '30-40秒', content: '最精彩片段' },
          { time: '40-45秒', content: '互动引导（评论/转发）' }
        ],
        tags: pick(['#短剧 #热门', '#讨论度高', '#反转']),
        music: pick(['简洁BGM不抢戏', '低频节奏+口播', '轻快流行']),
        tips: 'X平台用户喜欢有话题性和讨论价值的内容'
      }
    };

    const platform = getPlatformInfo(platformId);
    const tpl = (scriptTemplates as any)[platform.id] || (scriptTemplates as any)['tiktok'];
    return {
      platformId,
      platformName: platform.name,
      platformIcon: platform.icon,
      platformColor: platform.color,
      ...tpl
    };
  };

  // 重新生成脚本（单个平台或全部）
  const handleRegenerateScript = async (platformId?: string) => {
    if (artifact.type !== 'script') return;

    // AI消息模拟与状态
    setIsTyping(true);
    const targetPlatformIds: string[] = platformId
      ? [platformId]
      : (artifact.data?.platforms as string[]);

    // 生成新脚本内容
    const newScripts = (artifact.data?.scripts as any[]).map((s: any) => {
      if (targetPlatformIds.includes(s.platformId)) {
        return generateScript(selectedDrama || artifact.data?.drama, s.platformId);
      }
      return s;
    });

    // 添加用户+AI对话记录
    const platformText = platformId ? getPlatformInfo(platformId).name : '全部平台';

    addMessage({ type: 'user', content: `修改脚本（${platformText}）` });

    // 模拟AI响应并更新UI
    setTimeout(() => {
      setArtifact(prev => ({
        ...(prev as any),
        type: 'script',
        data: {
          ...(prev as any).data,
          scripts: newScripts,
        },
      }));
      setIsTyping(false);
      addMessage({
        type: 'ai',
        agent: '短剧脚本大师',
        content: `我已根据最新思路为${platformText}重新生成了一版脚本，您可以展开查看。若需进一步微调，请告诉我更具体的方向～`,
      });
    }, 800);
  };

  const handleStartEditing = async () => {
    setCurrentStep(4);

    const message = '脚本确认，开始剪辑吧！';
    addMessage({
      type: 'user',
      content: message
    });

    setIsTyping(true);

    try {
      const response = await aiService.sendMessage(message);
      setIsTyping(false);

      addMessage({
        type: 'ai',
        content: response.response,
        agent: response.agent_name
      });

      setTimeout(() => {
        setArtifact({
          type: 'video-editing',
          data: {
            drama: selectedDrama,
            platforms: selectedPlatforms.map(id => getPlatformInfo(id))
          }
        });
      }, 2000);

    } catch (error) {
      setIsTyping(false);
      console.error('Error:', error);
    }
  };

  const steps = [
    { label: '选择短剧', status: currentStep >= 1 ? 'completed' : 'pending' },
    { label: '选择平台', status: currentStep >= 2 ? 'completed' : currentStep === 1 ? 'active' : 'pending' },
    { label: '生成脚本', status: currentStep >= 3 ? 'completed' : currentStep === 2 ? 'active' : 'pending' },
    { label: '智能剪辑', status: currentStep >= 4 ? 'active' : 'pending' }
  ];

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-black/30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                返回
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-white">AI短剧推广工作台</span>
              </div>
            </div>

            {/* Progress steps */}
            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                    step.status === 'completed'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : step.status === 'active'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-white/5 text-gray-500 border border-white/10'
                  }`}>
                    {step.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                    <span>{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 mx-1 text-gray-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 后端状态提示 */}
          {backendError && (
            <div className="mt-2 flex items-center gap-2 text-amber-400 text-sm bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/30">
              <AlertCircle className="w-4 h-4" />
              <span>{backendError} - 启动命令: python backend/backend_api.py</span>
            </div>
          )}
        </div>
      </header>

      {/* Main content - Split view */}
      <div className="flex-1 relative z-10 flex overflow-hidden">
        {/* Left side - Chat */}
        <div className={`flex flex-col transition-all duration-300 ${
          artifact.type && isArtifactExpanded ? 'w-1/2' : 'w-full'
        }`}>
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-3xl mx-auto flex flex-col space-y-6 pb-6">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <Avatar className="w-10 h-10 border-2 border-blue-500/50">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                      <Bot className="w-5 h-5 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 backdrop-blur-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <div className="border-t border-white/10 backdrop-blur-xl bg-black/30 p-6">
            <div className="max-w-3xl mx-auto">
              {/* 文件预览区域 */}
              {uploadedFiles.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      <Paperclip className="w-4 h-4 text-blue-400" />
                      <span className="max-w-[200px] truncate">{file.name}</span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="ml-1 hover:bg-white/10 rounded p-0.5"
                      >
                        <X className="w-3 h-3 text-gray-400 hover:text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="relative">
                {/* 隐藏的文件上传input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="video/*,image/*,.pdf,.doc,.docx,.txt"
                />

                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="输入您的需求... (Enter发送，Shift+Enter换行)"
                  className="w-full bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-2xl resize-none pr-24 min-h-[60px] backdrop-blur-xl focus:bg-white/10 focus:border-blue-500/50"
                />

                {/* 右侧按钮组 */}
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  {/* 文件上传按钮 */}
                  <Button
                    type="button"
                    onClick={handleUploadClick}
                    variant="ghost"
                    className="w-10 h-10 p-0 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                  >
                    <Paperclip className="w-5 h-5" />
                  </Button>

                  {/* 发送按钮 */}
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="w-10 h-10 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </Button>
                </div>
              </div>

              {/* Quick actions */}
              {messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-3"
                >
                  <span className="text-gray-500 text-sm">快速开始：</span>
                  <Button
                    onClick={() => setInputValue('今日短剧日榜是什么？')}
                    variant="ghost"
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 text-sm h-8"
                  >
                    查看今日短剧排行榜
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Artifacts */}
        <AnimatePresence>
          {artifact.type && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: isArtifactExpanded ? '50%' : '0%', opacity: isArtifactExpanded ? 1 : 0 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-l border-white/10 backdrop-blur-xl bg-black/20 flex flex-col overflow-hidden"
            >
              {/* Artifact header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white">
                      {artifact.type === 'drama-ranking' && '短剧热度排行榜'}
                      {artifact.type === 'platform-selector' && '选择推广平台'}
                      {artifact.type === 'script' && '推广脚本方案'}
                      {artifact.type === 'video-editing' && 'AI智能剪辑'}
                    </h3>
                    <p className="text-gray-400 text-sm">实时展示</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsArtifactExpanded(!isArtifactExpanded)}
                  className="text-gray-400 hover:text-white"
                >
                  {isArtifactExpanded ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Artifact content */}
              <div className="flex-1 overflow-y-auto p-6">
                {artifact.type === 'drama-ranking' && (
                  <DramaRankingArtifact
                    data={artifact.data}
                    onSelectDrama={handleSelectDrama}
                  />
                )}
                {artifact.type === 'platform-selector' && (
                  <PlatformSelectorArtifact
                    data={artifact.data}
                    onConfirm={handleConfirmPlatforms}
                  />
                )}
                {artifact.type === 'script' && (
                  <ScriptArtifact
                    data={artifact.data}
                    onStartEditing={handleStartEditing}
                    onRegenerateScript={handleRegenerateScript}
                  />
                )}
                {artifact.type === 'video-editing' && (
                  <VideoEditingArtifact data={artifact.data} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.type === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 max-w-[85%] ${
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
      }`}
    >
      {/* Avatar */}
      {isUser ? (
        <Avatar className="w-10 h-10 border-2 border-purple-500/50 flex-shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600">
            <User className="w-5 h-5 text-white" />
          </AvatarFallback>
        </Avatar>
      ) : (
        <Avatar className="w-10 h-10 border-2 border-blue-500/50 flex-shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
            <Bot className="w-5 h-5 text-white" />
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Agent name (AI only) */}
        {!isUser && message.agent && (
          <div className="flex items-center gap-2 mb-1 ml-1">
            <span className="text-blue-400 text-sm">{message.agent}</span>
            <Sparkles className="w-3 h-3 text-blue-400" />
          </div>
        )}

        <div
          className={
            isUser
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-lg shadow-blue-900/30'
              : 'bg-white/5 border border-white/10 text-white rounded-2xl rounded-tl-none backdrop-blur-xl px-4 py-3'
          }
        >
          <p className={isUser ? 'whitespace-pre-wrap text-left' : 'whitespace-pre-wrap'}>{message.content}</p>
        </div>

        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'mr-1' : 'ml-1'}`}>
          {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
}
