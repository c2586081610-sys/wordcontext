#!/bin/bash
# Kokoro TTS 启动脚本
# 用法: ./start.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "📦 激活虚拟环境..."
source venv/bin/activate

echo "🚀 启动 Kokoro TTS 服务..."
echo "🎯 访问地址: http://localhost:8765"
echo "📖 API 文档: http://localhost:8765/docs"
echo ""

python app.py