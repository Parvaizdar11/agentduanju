#!/bin/bash

# 短剧剪辑推广 - 一键启动脚本
# 同时启动前端和后端服务

echo "🚀 启动短剧剪辑推广系统..."
echo ""

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到 Python3，请先安装 Python"
    exit 1
fi

# 检查Node.js是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到 npm，请先安装 Node.js"
    exit 1
fi

# 检查后端依赖
echo "📦 检查后端Python依赖..."
if [ ! -d "backend/__pycache__" ]; then
    echo "正在安装后端依赖..."
    pip3 install -r backend/requirements.txt
fi

# 检查前端依赖
echo "📦 检查前端依赖..."
if [ ! -d "node_modules" ]; then
    echo "正在安装前端依赖..."
    npm install
fi

echo ""
echo "✅ 依赖检查完成"
echo ""

# 检查端口8000是否被占用
echo "🔍 检查端口8000..."
if lsof -i :8000 > /dev/null 2>&1; then
    echo "⚠️  端口8000已被占用，正在停止..."
    OLD_PID=$(lsof -t -i :8000)
    kill $OLD_PID 2>/dev/null
    sleep 2
    echo "✅ 已释放端口8000"
fi

# 启动后端服务(后台运行)
echo "🔧 启动后端服务 (端口 8000)..."
cd backend
python3 backend_api.py > backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 检查后端是否成功启动
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo "✅ 后端服务启动成功 (PID: $BACKEND_PID)"
    echo "   API地址: http://localhost:8000"
    echo "   API文档: http://localhost:8000/docs"
else
    echo "❌ 后端服务启动失败，请检查 backend/backend.log"
    echo ""
    echo "📋 最后10行日志:"
    tail -10 backend/backend.log
    exit 1
fi

echo ""

# 启动前端服务
echo "🎨 启动前端服务 (端口 5173)..."
echo "   前端地址: http://localhost:5173"
echo ""
echo "============================================"
echo "🎉 系统启动完成！"
echo "============================================"
echo ""
echo "📱 前端访问: http://localhost:5173"
echo "🔌 后端API: http://localhost:8000"
echo "📚 API文档: http://localhost:8000/docs"
echo ""
echo "💡 提示: 按 Ctrl+C 停止服务"
echo ""

# 启动前端(前台运行)
npm run dev

# 当前端停止时，也停止后端
echo ""
echo "🛑 正在停止后端服务..."
kill $BACKEND_PID 2>/dev/null
echo "✅ 服务已停止"
