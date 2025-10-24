import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Info } from 'lucide-react';
import { Button } from '../ui/button';

interface PlatformSelectorArtifactProps {
  data: {
    drama: any;
    platforms: any[];
  };
  onConfirm: (platforms: string[]) => void;
}

const platforms = [
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    icon: '🎵', 
    color: 'from-black to-cyan-500', 
    description: '15-60秒短视频',
    features: ['年轻用户群体', '快节奏内容', '强算法推荐', '高传播性'],
    bestFor: '爽剧、反转剧情'
  },
  { 
    id: 'facebook', 
    name: 'Facebook', 
    icon: '👥', 
    color: 'from-blue-600 to-blue-700', 
    description: '1-3分钟视频',
    features: ['用户年龄较高', '完整故事', '社交分享', '评论互动'],
    bestFor: '情感剧、家庭剧'
  },
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: '📸', 
    color: 'from-purple-600 via-pink-600 to-orange-500', 
    description: 'Reels 90秒以内',
    features: ['视觉导向', '精美画面', '音乐同步', '时尚潮流'],
    bestFor: '都市爱情、时尚剧'
  },
  { 
    id: 'x', 
    name: 'X (Twitter)', 
    icon: '🐦', 
    color: 'from-black to-gray-800', 
    description: '2分钟视频',
    features: ['话题讨论', '实时热点', '转发传播', '意见领袖'],
    bestFor: '热门话题、争议剧情'
  }
];

export function PlatformSelectorArtifact({ data, onConfirm }: PlatformSelectorArtifactProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const handleTogglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(id => id !== platformId);
      }
      return [...prev, platformId];
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl text-white mb-2">🎯 选择推广平台</h2>
        <p className="text-gray-400">为《{data.drama.title}》选择最合适的社交媒体平台</p>
      </div>

      {/* Platform cards */}
      <div className="grid grid-cols-1 gap-4">
        {platforms.map((platform, index) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          
          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleTogglePlatform(platform.id)}
              className={`cursor-pointer rounded-xl p-5 transition-all backdrop-blur-xl border-2 ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20'
                  : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Platform icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-3xl flex-shrink-0 shadow-lg`}>
                  {platform.icon}
                </div>

                {/* Platform info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-white text-lg">{platform.name}</h3>
                      <p className="text-gray-400 text-sm">{platform.description}</p>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {platform.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Best for */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30">
                    <span className="text-purple-300 text-sm">适合：{platform.bestFor}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selection summary */}
      {selectedPlatforms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-5"
        >
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white mb-1">已选择 {selectedPlatforms.length} 个平台</h4>
              <p className="text-gray-400 text-sm">
                AI将为每个平台定制专属的推广脚本和剪辑方案，最大化传播效果。
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {selectedPlatforms.map(id => {
              const platform = platforms.find(p => p.id === id)!;
              return (
                <div
                  key={id}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${platform.color} text-white text-sm`}
                >
                  <span>{platform.icon}</span>
                  <span>{platform.name}</span>
                </div>
              );
            })}
          </div>

          <Button
            onClick={() => onConfirm(selectedPlatforms)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0"
          >
            确认选择，生成推广脚本
          </Button>
        </motion.div>
      )}

      {selectedPlatforms.length === 0 && (
        <div className="text-center p-6 bg-white/5 border border-white/10 rounded-xl">
          <p className="text-gray-400">请至少选择一个推广平台</p>
        </div>
      )}
    </div>
  );
}
