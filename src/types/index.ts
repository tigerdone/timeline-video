import { Clip } from "@/components/ClipItem"

export interface Asset {
  id: string
  type: 'video' | 'audio' | 'image'
  name: string
  duration: number  // 默认时长（秒）
  color: string
}

export interface DropEvent {
  clip: Clip,
  isResizing?: boolean,
  isCreate?: true,
  trackId?: string
}
  