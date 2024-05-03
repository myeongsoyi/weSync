import { Tabs } from 'antd';
import Public from '../public';
import Private from '../private';
import { Suspense } from 'react';
import FixedAudioPlayer from '@/components/common/FixedAudioPlayer';
import MultiAudioPlayer from '@/components/common/MultiAudioPlayer';

export default function WorkSpaceTabs() {
  const label: React.ReactNode[] = [
    <div className="w-max text-center" key={'public-tab'}>
      <span>PUBLIC</span>
    </div>,
    <div className="w-max text-center" key={'private-tab'}>
      <span>PRIVATE</span>
    </div>,
  ];
  const contents: React.ReactNode[] = [
    <Suspense key={'public'}>
      <Public />
    </Suspense>,
    <Suspense key={'private'}>
      <Private />
    </Suspense>,
  ];

  return (
    <>
      <Tabs
        defaultActiveKey="1"
        size="large"
        centered
        moreIcon={null}
        items={new Array(2).fill(null).map((_, i) => {
          const id = String(i + 1);
          return {
            label: label[i],
            key: id,
            children: contents[i],
          };
        })}
        className="tabs-custom"
      ></Tabs>
      <FixedAudioPlayer />
      <MultiAudioPlayer />
    </>
  );
}
