import { motion } from 'motion/react';
import { TrendingUp, Eye, Heart, Flame, Star, Play } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface DramaRankingArtifactProps {
  data: {
    dramas: any[];
  };
  onSelectDrama: (drama: any) => void;
}

export function DramaRankingArtifact({ data, onSelectDrama }: DramaRankingArtifactProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl text-white mb-2">📊 今日短剧热度榜</h2>
        <p className="text-gray-400">根据播放量、点赞数和用户评分综合排名</p>
      </div>

      <div className="space-y-4">
        {data.dramas.map((drama, index) => (
          <motion.div
            key={drama.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 hover:bg-white/10 transition-all backdrop-blur-xl">
              <div className="flex items-start gap-4 p-4">
                {/* Rank badge */}
                <div className="relative flex-shrink-0">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    drama.rank === 1 ? 'bg-gradient-to-br from-yellow-500 to-orange-600' :
                    drama.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    drama.rank === 3 ? 'bg-gradient-to-br from-orange-600 to-orange-800' :
                    'bg-gradient-to-br from-blue-500 to-purple-600'
                  }`}>
                    <span className="text-white text-2xl">{drama.rank}</span>
                  </div>
                  {drama.rank <= 3 && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1"
                    >
                      <Flame className="w-6 h-6 text-orange-500 drop-shadow-lg" />
                    </motion.div>
                  )}
                </div>

                {/* Thumbnail */}
                <div className="relative w-32 h-44 rounded-lg overflow-hidden flex-shrink-0 group">
                  <img 
                    src={drama.thumbnail} 
                    alt={drama.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>

                  {/* Episodes badge */}
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 backdrop-blur-xl text-white text-xs">
                    {drama.episodes}集
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-white text-lg group-hover:text-blue-400 transition-colors">
                      {drama.title}
                    </h3>
                    <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0" />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {drama.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">{drama.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{drama.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span>{drama.views}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Heart className="w-4 h-4" />
                        <span>{drama.likes}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => onSelectDrama(drama)}
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0"
                    >
                      选择推广
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-white mb-1">数据更新</h4>
            <p className="text-gray-400 text-sm">
              排行榜每小时更新一次，数据来源于全平台综合统计。选择热门短剧可以获得更好的推广效果。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
