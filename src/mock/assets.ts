import { Asset } from '@/types/index';

// assets.ts
export const sampleAssets: Asset[] = [
  // 视频资源
  {
    id: 'video-1',
    type: 'video',
    name: '开场镜头',
    duration: 8,
    color: '#FF6B6B',  // 红色系
  },
  {
    id: 'video-2',
    type: 'video',
    name: '城市空拍',
    duration: 12,
    color: '#FF8E8E',
  },
  {
    id: 'video-3',
    type: 'video',
    name: '产品特写',
    duration: 6,
    color: '#FF5252',
  },

  // 音频资源
  {
    id: 'audio-1',
    type: 'audio',
    name: '背景音乐',
    duration: 30,
    color: '#4ECDC4',  // 蓝绿色系
  },
  {
    id: 'audio-2',
    type: 'audio',
    name: '欢呼声效',
    duration: 4,
    color: '#45B7D1',
  },
  {
    id: 'audio-3',
    type: 'audio',
    name: '旁白录音',
    duration: 15,
    color: '#3BAFDA',
  },

  // 图像资源
  {
    id: 'image-1',
    type: 'image',
    name: '公司LOGO',
    duration: 5,        // 图片默认显示时长
    color: '#6BFF6B',  // 绿色系
  },
  {
    id: 'image-2',
    type: 'image',
    name: '背景底图',
    duration: 10,
    color: '#8EFF8E',
  },
  {
    id: 'image-3',
    type: 'image',
    name: '产品水印',
    duration: 3,
    color: '#52FF52',
  }
];