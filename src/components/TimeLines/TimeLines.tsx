'use client'

import { useCallback, useReducer, useRef } from 'react';
import Track from '@/components/Track';
import { TRACK_HEIGHT, PIXELS_PER_SECOND, TIME_SCALE, RESIZABLE_HEIGHT, TIME_LINE_SPACE } from '@/constants';
import tracksReducer from './reduces';
import { DropEvent } from '@/types';
import { useDrop } from 'react-dnd';
import dog2 from '@/assets/images/dog2.webp'
import dog from '@/assets/images/dog.webp'

const Timeline = () => {
  const timelineContainer = useRef<HTMLDivElement>(null);
  console.log(dog)

  const handleSelectStart = () => {

  }

  const [tracks, dispatch] = useReducer(tracksReducer, [
    { 
      id: 'track-1', 
      clips: [
        { id: 'clip-1', start: 0, end: 5, color: '#FF6B6B', url: dog2.src },
        { id: 'clip-2', start: 6, end: 10, color: '#4ECDC4', url: dog2.src }
      ]
    },
    { 
      id: 'track-2', 
      clips: [
        { id: 'clip-3', start: 3, end: 8, color: '#45B7D1', url: dog2.src }
      ]
    },
    // { 
    //   id: 'track-3', 
    //   clips: []
    // },
    // { 
    //   id: 'track-4', 
    //   clips: []
    // },
    // { 
    //   id: 'track-5', 
    //   clips: []
    // }
  ])

  // 使用示例：
  const handleResize = (clipId: string, start: number, end: number) => {
    dispatch({
      type: 'RESIZE_CLIP',
      payload: { clipId, start, end }
    })
  }

  const handleDrop = useCallback((eventPayLoad: DropEvent, position: { x: number; y: number }) => {
    // const timeline = document.querySelector('.timeline-container');
    const timeline = timelineContainer.current;
    if (!timeline) return;

    const rect = timeline.getBoundingClientRect();
    const x = position.x - rect.left;
    const y = position.y - rect.top + RESIZABLE_HEIGHT/2 - TIME_SCALE - TIME_LINE_SPACE; // 每个元素中心距第一个轨道的高度
    const trackLineHeight = TRACK_HEIGHT + TIME_LINE_SPACE;

    // 应该放在哪一条轨道
    let trackIndex = Math.floor(y / trackLineHeight);
    // 是否应该创建新轨道
    let shouldCreateTrack = (y % trackLineHeight - TRACK_HEIGHT ) > 0;
    if (trackLineHeight * tracks.length < y) {
      shouldCreateTrack = true;
      trackIndex = tracks.length - 1;
    }

    console.log('track', tracks);
    console.log('handleDrop item', eventPayLoad);
    console.log('handleDrop position', position);
    console.log('handleDrop rect', rect);
    console.log('handleDrop', x, y);
    console.log('trackIndex', trackIndex);
    console.log('shouldCreateTrack', shouldCreateTrack);

    // 忽略调整操作中的拖放
    // if ((item.clip as Clip).id.startsWith('resizing')) return;

    const displacement = Math.max(0, x / PIXELS_PER_SECOND);
    const { clip, trackId } = eventPayLoad;
    let newTrackIndex = tracks.findIndex(t => t.id === trackId);
    if(shouldCreateTrack) {
      dispatch({
        type: 'CREATE_TRACK',
        payload: { position: trackIndex + 1}
      });
      newTrackIndex = tracks.length;
    }


    if (trackId && newTrackIndex !== -1 && newTrackIndex !== trackIndex) {
      dispatch({
        type: 'MOVE_CLIP',
        payload: {
          clipId: clip.id,
          fromTrackId: trackId,
          toTrackIndex: trackIndex + (shouldCreateTrack ? 1 : 0),
          updates: {
            start: displacement,
            end: clip.end - clip.start + displacement,
          }
        }
      })
      return;
    }

    if (eventPayLoad.isCreate) {
      dispatch({
        type: 'ADD_CLIP_TO_TRACK',
        payload: {
          toTrackIndex: trackIndex + (shouldCreateTrack ? 1 : 0),
          clip: {
            ...clip,
            start: displacement,
            end: clip.end - clip.start + displacement,
          }
        }
      })
      return;
    }
    dispatch({
      type: 'UPDATE_CLIP',
      payload: {
        toTrackIndex: trackIndex + (shouldCreateTrack ? 1 : 0),
        clip,
        updates: {
          start: displacement,
          end: clip.end - clip.start + displacement,
        }
      }
    })
  }, [tracks]);

  const [, drop] = useDrop(() => ({
    accept: 'clip',
    drop: (item: DropEvent, monitor) => {
      const offset = monitor.getSourceClientOffset();
      if (offset) {
        handleDrop(item, { x: offset.x, y: offset.y });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    // tracks 发生变更必须重新执行useDrop，捕获新的handleDrop，handleDrop才能拿到新的tracks
  }), [tracks]);
  drop(timelineContainer)

  const [_, assetsDrop] = useDrop(() => ({
    accept: 'asset',
    // eslint-disable-next-line
    drop: (item: any, monitor) => {
      const offset = monitor.getSourceClientOffset();
      if (offset) {
        console.log({ x: offset.x, y: offset.y });
        console.log(item, _);
        const payLoad: DropEvent = {
          isResizing: false,
          isCreate: true,
          clip: {
            id: item.asset.id,
            start: 0,
            end: item.asset.duration,
            color: item.asset.color,
            url: dog.src
          }
        }
        handleDrop(payLoad, { x: offset.x, y: offset.y });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    // tracks 发生变更必须重新执行useDrop，捕获新的handleDrop
  }), [tracks]);
  assetsDrop(timelineContainer)

  return (
      <div ref={timelineContainer} className="timeline-container relative text-white overflow-auto h-full">
        {/* Time Ruler */}
        <div className="sticky top-0 z-10 bg-gray-900 flex items-center" style={{ height: TIME_SCALE }}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute border-l border-gray-400 px-1"
              style={{ left: i * PIXELS_PER_SECOND}}
            >
              {i}s
            </div>
          ))}
        </div>

        {/* Tracks */}
        {tracks.map((track) => (
          <Track
            key={track.id}
            track={track}
            // index={index}
            onDrop={handleDrop}
            onDragStart={handleSelectStart}
            onResize={handleResize}
          />
        ))}
        {/* <div className="h-12 bg-gray-800 mt-5" style={{ height: TRACK_HEIGHT }}/>  */}
        {/* Spacer for new track creation */}
      </div>

  );
};

export default Timeline;