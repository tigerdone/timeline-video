# 视频编辑器时间轴组件

基于 Next.js + Tailwind CSS 打造的响应式视频编辑器时间轴界面，集成拖放和调整尺寸功能

体验地址：http://120.78.205.46:3000/

![时间轴预览](./src/assets/demo.mp4)

## 核心功能

- 🕒 可视化多轨道时间轴布局
- ↔️ 可调整剪辑片段的入点/出点
- 🧱 跨轨道拖放重新排列剪辑
- ➕ 在轨道之间拖放时自动创建新轨道
- 🎥 支持从外部拖入媒体资源
- 📱 响应式自适应布局

## 技术栈

- **框架**: Next.js 15
- **样式**: Tailwind CSS
- **拖放库**: [react-dnd](https://react-dnd.github.io/react-dnd/)
- **片段尺寸调整**: [react-resizable](https://www.npmjs.com/package/react-resizable)

## 安装指南

1. 克隆仓库：
```bash
git clone git@github.com:tigerdone/timeline-video.git
```

2. 安装依赖：
```bash
npm install
# 或
yarn
# 或
pnpm install
```

3. 启动开发服务器：
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```
