import { Tabs } from 'antd';
import Public from '../public';
import Private from '../private';
import { Suspense } from 'react';

export default function WorkSpaceTabs() {
  const label: React.ReactNode[] = [
    <div className="w-max text-center">
      <span>PUBLIC</span>
    </div>,
    <div className="w-max text-center">
      <span>PRIVATE</span>
    </div>,
  ];
  const contents: React.ReactNode[] = [
    <Suspense>
      <Public />
    </Suspense>,
    <Suspense>
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
    </>
  );
}
