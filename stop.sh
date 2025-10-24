#!/bin/bash

# 停止短剧剪辑推广系统的所有服务

echo "🛑 停止短剧剪辑推广系统..."
echo ""

# 停止后端服务(端口8000)
if lsof -i :8000 > /dev/null 2>&1; then
    BACKEND_PID=$(lsof -t -i :8000)
    echo "🔧 停止后端服务 (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null
    sleep 1

    # 如果还在运行,强制停止
    if kill -0 $BACKEND_PID 2>/dev/null; then
        echo "   强制停止..."
        kill -9 $BACKEND_PID 2>/dev/null
    fi

    echo "   ✅ 后端服务已停止"
else
    echo "   ℹ️  后端服务未运行"
fi

# 停止前端服务(端口5173)
if lsof -i :5173 > /dev/null 2>&1; then
    FRONTEND_PID=$(lsof -t -i :5173)
    echo "🎨 停止前端服务 (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID 2>/dev/null
    sleep 1

    # 如果还在运行,强制停止
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "   强制停止..."
        kill -9 $FRONTEND_PID 2>/dev/null
    fi

    echo "   ✅ 前端服务已停止"
else
    echo "   ℹ️  前端服务未运行"
fi

echo ""
echo "✅ 所有服务已停止"
