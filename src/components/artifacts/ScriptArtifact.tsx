import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, Hash, Music, Lightbulb, ChevronDown, ChevronUp, Edit, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ScriptArtifactProps {
  data: {
    drama: any;
    scripts: any[];
    platforms: string[];
  };
  onStartEditing: () => void;
  // 触发重新生成脚本（单平台或全部）
  onRegenerateScript?: (platformId?: string) => void;
}

export function ScriptArtifact({ data, onStartEditing, onRegenerateScript }: ScriptArtifactProps) {
  const [expandedScript, setExpandedScript] = useState<string | null>(data.scripts[0]?.platformId || null);

  const toggleScript = (platformId: string) => {
    setExpandedScript(expandedScript === platformId ? null : platformId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl text-white mb-2">📝 AI生成推广脚本</h2>
        <p className="text-gray-400">为《{data.drama.title}》定制的多平台推广方案</p>
      </div>

      {/* Scripts */}
      <div className="space-y-4">
        {data.scripts.map((script, index) => {
          const isExpanded = expandedScript === script.platformId;
          
          return (
            <motion.div
              key={script.platformId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-xl overflow-hidden backdrop-blur-xl"
            >
              {/* Script header */}
              <div
                onClick={() => toggleScript(script.platformId)}
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${script.platformColor} flex items-center justify-center text-2xl shadow-lg`}>
                    {script.platformIcon}
                  </div>
                  <div>
                    <h3 className="text-white text-lg">{script.platformName} 推广脚本</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{script.duration}</span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                        AI生成
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
              </div>

              {/* Script content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-4 border-t border-white/10 pt-4">
                      {/* Hook */}
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400 text-sm">{script.hook}</span>
                        </div>
                        <p className="text-white">{script.hookContent}</p>
                      </div>

                      {/* Structure */}
                      <div>
                        <h4 className="text-white mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-400" />
                          剪辑结构
                        </h4>
                        <div className="space-y-2">
                          {script.structure.map((item: any, i: number) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className={`flex items-start gap-3 p-3 rounded-lg ${
                                item.highlight 
                                  ? 'bg-purple-500/10 border border-purple-500/30' 
                                  : 'bg-white/5'
                              }`}
                            >
                              <div className={`w-20 flex-shrink-0 px-2 py-1 rounded text-center text-xs ${
                                item.highlight
                                  ? 'bg-purple-500/20 text-purple-300'
                                  : 'bg-white/10 text-gray-400'
                              }`}>
                                {item.time}
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-300 text-sm">{item.content}</p>
                              </div>
                              {item.highlight && (
                                <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Tags and Music */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Hash className="w-4 h-4 text-cyan-400" />
                            <span className="text-white text-sm">推荐标签</span>
                          </div>
                          <p className="text-cyan-400 text-sm">{script.tags}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Music className="w-4 h-4 text-pink-400" />
                            <span className="text-white text-sm">配乐建议</span>
                          </div>
                          <p className="text-gray-300 text-sm">{script.music}</p>
                        </div>
                      </div>

                      {/* Tips */}
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-yellow-400 text-sm">创作提示</span>
                            <p className="text-gray-300 text-sm mt-1">{script.tips}</p>
                          </div>
                        </div>
                      </div>

                      {/* Edit button */}
                      <Button
                        type="button"
                        onClick={() => onRegenerateScript?.(script.platformId)}
                        variant="outline"
                        size="sm"
                        className="w-full border-white/20 text-white bg-transparent dark:bg-transparent hover:bg-white/10"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        修改此脚本
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Summary and action */}
      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h4 className="text-white mb-1">脚本方案已就绪</h4>
            <p className="text-gray-400 text-sm">
              已为 {data.scripts.length} 个平台生成专属推广脚本。如需修改，请在左侧对话框告诉我具体要求。
              确认无误后，即可开始AI智能剪辑。
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onStartEditing}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            确认脚本，开始剪辑
          </Button>
          <Button
            type="button"
            onClick={() => onRegenerateScript?.()}
            variant="outline"
            className="border-white/20 text-white bg-transparent dark:bg-transparent hover:bg-white/10"
          >
            <Edit className="w-4 h-4 mr-2" />
            修改（全部）
          </Button>
        </div>
      </div>
    </div>
  );
}

// Import AnimatePresence
import { AnimatePresence } from 'motion/react';
