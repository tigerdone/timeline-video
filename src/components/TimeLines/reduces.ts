import { TrackItem } from '@/components/Track';
import { Clip } from '@/components/ClipItem';

type TrackAction =
  | { type: 'MOVE_CLIP'; payload: { clipId: string; fromTrackId: string; toTrackId?: string; toTrackIndex?: number; updates: Partial<Clip> } }
  | { type: 'RESIZE_CLIP'; payload: { clipId: string; start: number; end: number } }
  | { type: 'CREATE_TRACK'; payload: { position: number } }
  | { type: 'UPDATE_CLIP'; payload: { toTrackId?: string; toTrackIndex?: number; clip: Clip; updates: Partial<Clip> } }
  | { type: 'ADD_CLIP_TO_TRACK'; payload: { toTrackId?: string; toTrackIndex?: number; clip: Clip; }}
  | { type: 'DELETE_CLIP'; payload: { clipId: string; trackId: string } }

// reducer.ts
const tracksReducer = (state: TrackItem[], action: TrackAction): TrackItem[] => {
  switch (action.type) {
    case 'MOVE_CLIP': {
      const { clipId, fromTrackId, toTrackId, toTrackIndex, updates } = action.payload
      
      // 深拷贝原始数据
      const prevTracks = JSON.parse(JSON.stringify(state)) as TrackItem[]
      
      // 查找源轨道和目标轨道
      const fromTrack = prevTracks.find(t => t.id === fromTrackId)
      const toTrack = toTrackId ? prevTracks.find(t => t.id === toTrackId) : prevTracks[toTrackIndex || 0]
      if (!fromTrack || !toTrack) return state

      // 提取要移动的剪辑
      const clipIndex = fromTrack.clips.findIndex(c => c.id === clipId)
      if (clipIndex === -1) return state
      let [movedClip] = fromTrack.clips.splice(clipIndex, 1)

      movedClip = { ...movedClip, ...updates }
      // 插入到目标轨道并排序
      toTrack.clips.push(movedClip)
      return prevTracks;

      // toTrack.clips.sort((a, b) => a.start - b.start)

      // // 自动调整时间轴
      // let currentEnd = 0
      // const adjustedClips = toTrack.clips.map(clip => {
      //   const duration = clip.end - clip.start
      //   const newStart = Math.max(clip.start, currentEnd)
      //   const newEnd = newStart + duration
      //   currentEnd = newEnd
      //   return { ...clip, start: newStart, end: newEnd }
      // })

      // 生成最终轨道状态
      // return prevTracks.map(track => {
      //   if (track.id === toTrackId) {
      //     return { ...track, clips: adjustedClips }
      //   }
      //   return track
      // })
    }

    case 'RESIZE_CLIP': {
      const { clipId, start, end } = action.payload
      return state.map(track => ({
        ...track,
        clips: track.clips.map(clip => 
          clip.id === clipId 
            ? { ...clip, start: Math.max(0, start), end: Math.max(start + 0.5, end) }
            : clip
        )
      }))
    }

    case 'CREATE_TRACK': {
      const { position } = action.payload
      const newTrack: TrackItem = {
        id: `track-${Date.now()}`,
        clips: []
      }
      
      // 确保position在合法范围内
      const safePosition = Math.max(0, Math.min(position, state.length))
      
      return [
        ...state.slice(0, safePosition),
        newTrack,
        ...state.slice(safePosition)
      ]
    }
    case 'UPDATE_CLIP': {
      const { clip, updates, toTrackIndex, toTrackId } = action.payload
      const toTrack = toTrackId ? state.find(t => t.id === toTrackId) : state[toTrackIndex || 0]
      if (toTrack === undefined) return state;

      console.log('updates', updates, toTrack)
      return state.map(track => {
        if (track.id !== toTrack.id) return track
        return ({
          ...track,
          clips: track.clips.map(clipI =>
            (clip.id === clipI.id) ? { ...clipI, ...updates } : clipI
          )
        })
      })
    }
    case 'ADD_CLIP_TO_TRACK': {
      const { clip, toTrackIndex, toTrackId } = action.payload
      const toTrack = toTrackId ? state.find(t => t.id === toTrackId) : state[toTrackIndex || 0]
      if (toTrack === undefined) return state;
      return state.map(track => {
        if (track.id === toTrack.id) {
          return {
            ...track,
            clips: [...track.clips, clip].sort((a, b) => a.start - b.start)
          }
        }
        return track
      })
    }
    

    case 'DELETE_CLIP': {
      const { clipId, trackId } = action.payload
      return state.map(track =>
        track.id === trackId
          ? { ...track, clips: track.clips.filter(c => c.id !== clipId) }
          : track
      )
    }

    default:
      return state
  }
}

export default tracksReducer;