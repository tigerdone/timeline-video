import { useRef } from 'react';
import ClipItem, { Clip } from '@/components/ClipItem';
import { TRACK_HEIGHT, TIME_LINE_SPACE } from '@/constants';
import { DropEvent } from '@/types';


export interface TrackItem {
  id: string;
  clips: Clip[];
}

export default function Track ({ 
  track, 
  onResize,
  onDragStart
}: { 
  track: TrackItem;
  onDrop: (item: DropEvent, position: { x: number; y: number }) => void;
  onResize: (clipId: string, newStart: number, newEnd: number) => void;
  onDragStart?: (clipId: string) => void
}) {
  const timelineContainer = useRef<HTMLDivElement>(null);

  const isOver = false;

  return (
    <div
      ref={timelineContainer}
      className='overflow-hidden'
    >
      <div
        className={`relative flex item-center bg-gray-800`}
        style={{ height: TRACK_HEIGHT, marginTop: TIME_LINE_SPACE }}
      >
        <div className={`relative top-1 pt-2 ${isOver ? 'bg-gray-100/20' : 'bg-transparent'}`}>

          {track.clips.map((clip) => (
            <ClipItem 
              key={clip.id} 
              clip={clip} 
              trackId={track.id} 
              onResize={onResize}
              onDragStart={onDragStart}
            />
          ))}
          </div>
        </div>
      </div>
  );
};