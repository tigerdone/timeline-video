import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // 启用静态导出
  images: {
    unoptimized: true, // 禁用默认的图片优化（静态导出需要）
  },
  // 可选：自定义导出路径
  // distDir: 'out', // 默认导出目录为 "out"
  trailingSlash: true, // 确保路径以斜杠结尾
};

export default nextConfig;
