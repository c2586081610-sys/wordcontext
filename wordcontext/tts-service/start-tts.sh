#!/bin/bash
# 词境 + Kokoro TTS 服务一键启动脚本
# 用法: ./start-all.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TTS_DIR="$SCRIPT_DIR"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 启动词境项目...${NC}"

# 检查 TTS 服务是否已运行
if curl -s http://localhost:8765/health > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Kokoro TTS 服务已运行 (端口 8765)${NC}"
else
  echo -e "${YELLOW}📦 启动 Kokoro TTS 服务...${NC}"
  cd "$TTS_DIR"
  source venv/bin/activate
  nohup python app.py > tts.log 2>&1 &
  TTS_PID=$!
  echo $TTS_PID > tts.pid
  sleep 5
  if curl -s http://localhost:8765/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Kokoro TTS 服务启动成功 (PID: $TTS_PID)${NC}"
  else
    echo -e "${RED}❌ Kokoro TTS 服务启动失败，查看日志: $TTS_DIR/tts.log${NC}"
    cat "$TTS_DIR/tts.log" | tail -10
  fi
fi

# 启动前端
echo -e "${YELLOW}🔨 启动前端开发服务器...${NC}"
cd "$PROJECT_DIR"
npm run dev > /dev/null 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > .frontend.pid

sleep 3
echo ""
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}  🎉 词境启动完成！${NC}"
echo -e "${GREEN}  📖 前端:    http://localhost:5173${NC}"
echo -e "${GREEN}  🔊 TTS:     http://localhost:8765${NC}"
echo -e "${GREEN}  📚 API文档: http://localhost:8765/docs${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo "停止命令: kill \$(cat $TTS_DIR/tts.pid) \$(cat $PROJECT_DIR/.frontend.pid)"