import { useState, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import { PIXELS_PER_SECOND, RESIZABLE_HEIGHT, TRACK_HEIGHT } from '@/constants';

export interface Clip {
  id: string;
  start: number;
  end: number;
  color: string;
  url: string;
}

export interface DraggableClipItem {
  clip: Clip;
  trackId: string;
  isResizing: boolean;
}

export interface ResizeHandlerProps {
  clip: Clip;
  trackId: string;
  onResize: (clipId: string, newStart: number, newEnd: number) => void;
  onDragStart?: (clipId: string) => void;
  onDragEnd?: () => void;
}

const ClipItem = ({ 
  clip,
  trackId,
  onResize,
  onDragStart,
  onDragEnd
}: ResizeHandlerProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const resizeTimeout = useRef<NodeJS.Timeout>(null);
  const dragElementRef = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag(() => ({
    type: 'clip',
    item: (): DraggableClipItem => ({
      clip,
      trackId,
      isResizing
    }),
    canDrag: () => {
      // // 禁用调整期间的拖拽
      if (isResizing) return false;
      // return true
      return true;
    },
    end: () => onDragEnd?.()
  }), [isResizing]);

  const handleResizeStart = () => {
    setIsResizing(true);
    // 添加延迟防止快速点击冲突
    resizeTimeout.current = setTimeout(() => setIsResizing(false), 500);
  };

  const handleResizeStop = () => {
    // clearTimeout(resizeTimeout.current);
    setIsResizing(false);
  };

  const handleResize = (
    _: React.SyntheticEvent,
    { size, handle }: ResizeCallbackData
  ) => {
    console.log('resizing')
    const widthDelta = size.width - (clip.end - clip.start) * PIXELS_PER_SECOND;
    const timeDelta = widthDelta / PIXELS_PER_SECOND;

    let newStart = clip.start;
    let newEnd = clip.end;

    if (handle === 'w') {
      newStart = Math.max(0, clip.start - timeDelta);
      newStart = Math.min(newStart, clip.end - 0.5); // 保持最小0.5秒
    } else {
      newEnd = Math.max(clip.end + timeDelta, clip.start + 0.5);
    }

    onResize(clip.id, newStart, newEnd);
  };

  drag(dragElementRef);

  return (
    <Resizable
      width={(clip.end - clip.start) * PIXELS_PER_SECOND}
      height={RESIZABLE_HEIGHT}
      axis="x"
      resizeHandles={['w', 'e']}
      minConstraints={[50, RESIZABLE_HEIGHT]} // 最小50px
      maxConstraints={[1000, RESIZABLE_HEIGHT]}
      onResizeStart={handleResizeStart}
      onResize={handleResize}
      onResizeStop={handleResizeStop}
      handle={(handleAxis, ref) => (
        <div
          ref={ref}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleResizeStart();
            onDragStart?.(clip.id);
          }}
          className={`absolute w-2 h-full bg-gray-800/50 hover:bg-gray-800/80 
            opacity-0 group-hover:opacity-100 cursor-col-resize transition-opacity
            ${handleAxis === 'w' ? 'left-0' : 'right-0'}
            ${isResizing ? '!opacity-100 !bg-gray-800' : ''}`}
        />
      )}
      className={`resizable-container ${isResizing ? 'resizing' : ''}`}
    >
      <div
        ref={dragElementRef}
        className={`
          absolute flex items-center p-2 rounded-lg group
          shadow-md hover:shadow-lg
          opacity-100
          bg-[length:auto_100%] bg-center w-full
          bg-repeat-x
          ${isResizing ? '!ring-2 !ring-yellow-400' : ''}`}
        style={{
          left: clip.start * PIXELS_PER_SECOND,
          width: (clip.end - clip.start) * PIXELS_PER_SECOND,
          backgroundColor: clip.color,
          height: TRACK_HEIGHT - 24,
          cursor: isResizing ? 'col-resize' : 'move',
          backgroundImage: `url(${clip.url})`

        }}
      >
        <span className="text-white font-medium text-sm truncate">
          Clip {clip.id.split('-')[1]}
          <span className="block text-xs font-normal opacity-75">
            {clip.start.toFixed(1)}s - {clip.end.toFixed(1)}s
          </span>
        </span>
      </div>
    </Resizable>
  );
};

export default ClipItem;