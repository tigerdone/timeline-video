'use client'

import TimeLines from '@/components/TimeLines/TimeLines';
import AssetPanel from '@/components/AssetsList/AssetsList';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import {sampleAssets} from '@/mock/assets';

const Page = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex overflow-scroll">
        <div className='w-1/6 bg-gray-800'>
          <AssetPanel assets={sampleAssets}/>
        </div>
{/*         
        <div className='w-5/6 bg-gray-700'>
          <div className='h-3/5'></div>
          <div className=' bg-gray-900 pl-5 overflow-scroll'>
            <TimeLines></TimeLines>
          </div>
        </div> */}
        
        <div className="h-screen flex flex-col w-full">
        {/* 上半部分 - 50% 高度 */}
          <div className="h-1/2 border-b bg-gray-700 p-4">
            <h1 className="text-2xl font-bold text-gray-50">上半部（50%）</h1>
            <p className='text-gray-50'>默认占满视口高度的 50%</p>
          </div>

          {/* 下半部分 - 50% 高度 + 内部滚动 */}
          <div className="h-1/2 overflow-y-auto  bg-gray-900 ">
            <div className="pl-4 space-y-2  h-full">
              <TimeLines />
              
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Page;