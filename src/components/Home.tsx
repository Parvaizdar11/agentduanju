import { useState } from 'react';
import { Sparkles, Wand2, Image, Video, ChevronRight, Play, Clock, TrendingUp, Paperclip, ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ChatPrompt } from './ChatPrompt';

interface HomeProps {
  onStartCreation: (data?: any) => void;
}

export function Home({ onStartCreation }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const templates = [
    {
      id: 1,
      title: '商业剧情',
      category: '剧情',
      image: 'https://images.unsplash.com/photo-1708195886023-3ecb00ac7a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTAxOTYzNHww&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '2-5分钟',
      trending: true
    },
    {
      id: 2,
      title: '古装传奇',
      category: '古装',
      image: 'https://images.unsplash.com/photo-1758647533619-a1fd66df438a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwaGlzdG9yaWNhbCUyMGRyYW1hfGVufDF8fHx8MTc2MDk1MTcxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '3-8分钟',
      trending: false
    },
    {
      id: 3,
      title: '都市爱情',
      category: '爱情',
      image: 'https://images.unsplash.com/photo-1749224280334-460eb823e0c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMG91dGRvb3J8ZW58MXx8fHwxNzYwOTI5MzkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      duration: '1-3分钟',
      trending: true
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNjAgMTAgTSAxMCAwIEwgMTAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-white">北斗AI剪辑中心</span>
              </div>
              <nav className="flex items-center gap-6">
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  我的项目
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">
                  往来中心
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">
                  我的收益
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">免费试用</span>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0">
                入驻
              </Button>
              <Avatar className="cursor-pointer">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500">B</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-48 border-r border-white/10 backdrop-blur-xl bg-black/20 z-10">
        <nav className="p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors group">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span>首页</span>
            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors group">
            <Video className="w-5 h-5" />
            <span>转历空间</span>
            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="relative z-10 ml-48 px-12 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-6">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <Sparkles className="w-16 h-16 text-blue-400 mx-auto" />
              </motion.div>
            </div>
            
            <h1 className="text-5xl mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Good Afternoon <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">barry</span>
            </h1>
            <p className="text-gray-400 text-xl mb-8">
              What will we <span className="text-blue-400">CREATE</span> today?
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={() => onStartCreation()}
                className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 border-0 px-8 py-6 text-lg shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                去生成精彩短片
                <Wand2 className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Search section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-5xl mx-auto mb-8"
          >
            <ChatPrompt
              value={searchQuery}
              onChange={setSearchQuery}
              onSend={(v) => {
                if (!v.trim()) return;
                onStartCreation({ initialMessage: v.trim() });
                setSearchQuery("");
              }}
            />
          </motion.div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4 mb-16"
          >
            <Button
              onClick={() => onStartCreation({ type: 'batch' })}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-0 px-6 py-6 rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
            >
              <Image className="w-4 h-4 mr-2" />
              批量图片转视频剪辑
            </Button>
            <Button
              onClick={() => onStartCreation({ type: 'intelligent' })}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 border-0 px-6 py-6 rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              智能动态剪辑
            </Button>
            <Button
              onClick={() => onStartCreation({ type: 'tiktok' })}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 px-6 py-6 rounded-2xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
            >
              <Video className="w-4 h-4 mr-2" />
              tiktok视频精剪版
            </Button>
          </motion.div>

          {/* Templates section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl text-white mb-8">
              See what you can <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">CREATE</span> with me
            </h2>

            <div className="grid grid-cols-3 gap-6">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group cursor-pointer"
                  onClick={() => onStartCreation({ template: template.id })}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-blue-500/50 transition-all">
                    {/* Image */}
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img
                        src={template.image}
                        alt={template.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Overlay content */}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 border-0">
                          {template.category}
                        </Badge>
                      </div>

                      {template.trending && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-yellow-500/90 backdrop-blur-xl rounded-full p-2">
                            <TrendingUp className="w-4 h-4 text-black" />
                          </div>
                        </div>
                      )}

                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>

                      {/* Bottom info */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white mb-2">{template.title}</h3>
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{template.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Floating action buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-20">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-xl shadow-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/60 transition-all"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center shadow-xl shadow-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/60 transition-all"
        >
          <Wand2 className="w-6 h-6 text-white" />
        </motion.button>
      </div>
    </div>
  );
}
