#!/bin/bash

echo "🧪 测试短剧剪辑推广系统..."
echo ""

# 测试1: 检查文件结构
echo "📁 检查文件结构..."
files=(
    "backend/agents.py"
    "backend/backend_api.py"
    "backend/requirements.txt"
    "src/services/api.ts"
    "src/components/CreationWorkspace.tsx"
    "start.sh"
)

all_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (缺失)"
        all_exist=false
    fi
done

if [ "$all_exist" = false ]; then
    echo ""
    echo "❌ 文件检查失败"
    exit 1
fi

echo ""
echo "✅ 文件结构检查通过"
echo ""

# 测试2: Python依赖
echo "📦 检查Python依赖..."
required_packages=("fastapi" "uvicorn" "pydantic" "openai")
all_installed=true

for package in "${required_packages[@]}"; do
    if pip3 show "$package" > /dev/null 2>&1; then
        version=$(pip3 show "$package" | grep "Version:" | cut -d " " -f 2)
        echo "  ✅ $package ($version)"
    else
        echo "  ❌ $package (未安装)"
        all_installed=false
    fi
done

if [ "$all_installed" = false ]; then
    echo ""
    echo "❌ Python依赖检查失败"
    echo "💡 运行: pip3 install -r backend/requirements.txt"
    exit 1
fi

echo ""
echo "✅ Python依赖检查通过"
echo ""

# 测试3: Node.js依赖
echo "📦 检查Node.js依赖..."
if [ -d "node_modules" ]; then
    echo "  ✅ node_modules存在"
else
    echo "  ❌ node_modules不存在"
    echo "💡 运行: npm install"
    exit 1
fi

echo ""
echo "✅ Node.js依赖检查通过"
echo ""

# 测试4: 后端模块导入
echo "🔧 测试后端模块..."
cd backend
if python3 -c "from agents import SmartWorkflowController; import backend_api" 2>/dev/null; then
    echo "  ✅ 后端模块导入成功"
else
    echo "  ❌ 后端模块导入失败"
    exit 1
fi
cd ..

echo ""
echo "✅ 后端模块测试通过"
echo ""

# 测试5: 前端构建
echo "🎨 测试前端构建..."
if npm run build > /dev/null 2>&1; then
    echo "  ✅ 前端构建成功"
else
    echo "  ❌ 前端构建失败"
    exit 1
fi

echo ""
echo "✅ 前端构建测试通过"
echo ""

# 全部通过
echo "============================================"
echo "🎉 所有测试通过!"
echo "============================================"
echo ""
echo "📝 使用说明:"
echo ""
echo "1. 启动系统:"
echo "   ./start.sh"
echo ""
echo "2. 访问应用:"
echo "   前端: http://localhost:5173"
echo "   后端API: http://localhost:8000"
echo "   API文档: http://localhost:8000/docs"
echo ""
echo "3. 测试对话:"
echo "   在应用中输入: '今日短剧日榜是什么?'"
echo ""
