import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Video, CheckCircle2, Loader2, Download, Share2, Eye, Sparkles, Scissors, Wand2, Music } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

interface VideoEditingArtifactProps {
  data: {
    drama: any;
    platforms: any[];
  };
}

export function VideoEditingArtifact({ data }: VideoEditingArtifactProps) {
  const [platformProgress, setPlatformProgress] = useState<Record<string, number>>({});
  const [completedPlatforms, setCompletedPlatforms] = useState<string[]>([]);
  const [currentStage, setCurrentStage] = useState('分析脚本');

  const stages = [
    { name: '分析脚本', icon: Sparkles, duration: 2000 },
    { name: '智能剪辑', icon: Scissors, duration: 8000 },
    { name: '添加特效', icon: Wand2, duration: 5000 },
    { name: '配乐合成', icon: Music, duration: 3000 },
    { name: '最终渲染', icon: Video, duration: 4000 }
  ];

  useEffect(() => {
    // Simulate progress for each platform
    data.platforms.forEach((platform, index) => {
      const startDelay = index * 2000;
      
      const interval = setInterval(() => {
        setPlatformProgress(prev => {
          const current = prev[platform.id] || 0;
          if (current >= 100) {
            clearInterval(interval);
            setCompletedPlatforms(completed => 
              completed.includes(platform.id) ? completed : [...completed, platform.id]
            );
            return prev;
          }
          return { ...prev, [platform.id]: Math.min(current + 2, 100) };
        });
      }, 200);

      setTimeout(() => {
        // Start the interval after delay
      }, startDelay);
    });

    // Cycle through stages
    let stageIndex = 0;
    const stageInterval = setInterval(() => {
      stageIndex = (stageIndex + 1) % stages.length;
      setCurrentStage(stages[stageIndex].name);
    }, 4000);

    return () => {
      clearInterval(stageInterval);
    };
  }, [data.platforms]);

  const allCompleted = completedPlatforms.length === data.platforms.length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="inline-block mb-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Video className="w-8 h-8 text-white" />
          </div>
        </motion.div>
        <h2 className="text-2xl text-white mb-2">
          {allCompleted ? '✅ 剪辑完成' : '🎬 AI智能剪辑中'}
        </h2>
        <p className="text-gray-400">
          {allCompleted 
            ? `已完成 ${data.platforms.length} 个平台的视频剪辑` 
            : `正在为《${data.drama.title}》生成推广视频`
          }
        </p>
      </div>

      {/* Current stage indicator */}
      {!allCompleted && (
        <motion.div
          key={currentStage}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-5 h-5 text-purple-400" />
            </motion.div>
            <span className="text-white">当前阶段：{currentStage}</span>
          </div>
        </motion.div>
      )}

      {/* Platform progress */}
      <div className="space-y-4">
        {data.platforms.map((platform, index) => {
          const progress = platformProgress[platform.id] || 0;
          const isCompleted = completedPlatforms.includes(platform.id);

          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`bg-white/5 border rounded-xl p-5 transition-all ${
                isCompleted 
                  ? 'border-green-500/50 bg-green-500/5' 
                  : 'border-white/10'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                {/* Platform icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                  {platform.icon}
                </div>

                {/* Platform info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white">{platform.name}</h3>
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 text-green-400"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm">已完成</span>
                      </motion.div>
                    ) : (
                      <span className="text-blue-400 text-sm">{Math.round(progress)}%</span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="relative">
                    <Progress value={progress} className="h-2 bg-white/10" />
                    {!isCompleted && (
                      <motion.div
                        className="absolute top-0 left-0 h-2 w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"
                        animate={{ x: ['0%', '400%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      />
                    )}
                  </div>

                  {/* Status text */}
                  <div className="mt-2 text-sm text-gray-400">
                    {isCompleted ? (
                      <span>视频已生成，时长 {platform.description}</span>
                    ) : (
                      <span>{currentStage}中...</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Preview section (when completed) */}
              {isCompleted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: 0.3 }}
                  className="border-t border-white/10 pt-4 mt-4"
                >
                  {/* Fake video preview */}
                  <div className="relative aspect-[9/16] max-w-xs mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                        <Eye className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-white text-sm">预览视频</p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      预览
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      下载
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Processing stages overview */}
      {!allCompleted && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h4 className="text-white mb-4">AI处理流程</h4>
          <div className="space-y-2">
            {stages.map((stage, index) => {
              const StageIcon = stage.icon;
              const isCurrent = stage.name === currentStage;
              
              return (
                <div
                  key={stage.name}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                    isCurrent ? 'bg-purple-500/20' : 'bg-transparent'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isCurrent 
                      ? 'bg-purple-500/30 text-purple-400' 
                      : 'bg-white/5 text-gray-500'
                  }`}>
                    <StageIcon className="w-4 h-4" />
                  </div>
                  <span className={`text-sm ${isCurrent ? 'text-white' : 'text-gray-400'}`}>
                    {stage.name}
                  </span>
                  {isCurrent && (
                    <motion.div
                      className="ml-auto"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completion summary */}
      {allCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-white text-lg mb-1">剪辑任务完成！</h3>
              <p className="text-gray-400 text-sm">
                已成功生成 {data.platforms.length} 个平台的推广视频，所有视频都已应用AI特效、转场和配乐。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0">
              <Download className="w-4 h-4 mr-2" />
              批量下载
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0">
              <Share2 className="w-4 h-4 mr-2" />
              分享到社交媒体
            </Button>
          </div>
        </motion.div>
      )}

      {/* AI insights */}
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-white mb-2">AI优化建议</h4>
            <ul className="space-y-1 text-gray-400 text-sm">
              <li>• 已自动识别并剪辑出最具传播力的片段</li>
              <li>• 根据平台特性优化了转场和节奏</li>
              <li>• 智能添加了吸引眼球的开场和结尾</li>
              <li>• 配乐与画面情感完美匹配</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
