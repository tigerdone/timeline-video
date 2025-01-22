// types.ts
import {  Asset } from '@/types/index';
// AssetItem.tsx
import { useDrag } from 'react-dnd'
import { useRef } from 'react';
import dog from '@/assets/images/dog.webp'

const AssetItem = ({ asset }: { asset: Asset }) => {
  const assetsList = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'asset',
    item: { asset },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
  }))
  drag(assetsList);

  return (
    <div
      ref={assetsList}
      className={`
        p-4 mb-2 rounded-lg cursor-move transition-all

        bg-[length:auto_100%] bg-center w-full
        bg-repeat-x
        ${
          isDragging ? 'opacity-50 bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'
        }`
      }
      style={{
        backgroundImage: `url(${dog.src})`
      }}
    >
      <div className="flex items-center">
        <div 
          className="w-4 h-4 rounded-sm mr-3"
          style={{ backgroundColor: asset.color }}
        />
        <span className="text-white text-sm">{asset.name}</span>
        <span className="text-gray-400 text-xs ml-2">
          {asset.duration}s
        </span>
      </div>
    </div>
  )
}

// AssetPanel.tsx
const AssetPanel = ({ assets }: { assets: Asset[] }) => {
  return (
    <div className="min-h-dvh bg-gray-900 p-4 border-r border-gray-700">
      <h3 className="text-white text-lg mb-4">媒体资源</h3>
      <div className="space-y-2">
        {assets.map(asset => (
          <AssetItem key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  )
}

export default AssetPanel