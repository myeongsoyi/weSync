'use client';

import { Table, Tag, Button } from 'antd';
import { useRef, useEffect } from 'react';
// import { getMainRecords } from '@/services/home';

interface IParams {
  records: {
    id: number;
    song: {
      id: number;
      name: string;
      url: string;
    };
    position: {
      name: string;
      color: string;
    };
    title: string;
    runTime: number;
    dateTime: {
      date: string;
      time: string;
    };
  }[];
}

export default function ListRecord({ records }: IParams) {
  const audiosRef = useRef<HTMLAudioElement[]>([]);
  // const { Column, ColumnGroup } = Table;
  const { Column } = Table;
  // console.log(records);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 각 오디오의 볼륨을 0.2로 설정
    audiosRef.current.forEach((audio) => {
      if (audio) {
        audio.volume = 0.2;
      }
    });
  }, []);

  return (
    <>
      <Table dataSource={records} pagination={false} rowKey="id">
        <Column
          title=""
          dataIndex="song"
          key="song"
          render={(song) => (
            <div className='flex'>
              <audio
                controls
                ref={(el) => {
                  audiosRef.current[song.id] = el as HTMLAudioElement;
                }}
                preload="auto"
              >
                <source src={`${song.url}`} type="audio/mpeg" />
              </audio>
              <Button className='m-auto'>댓글 모달</Button>
            </div>
          )}
        />
        <Column
          title="포지션"
          dataIndex="position"
          key="포지션"
          render={(position) => (
            <>
              <Tag
                style={{
                  border: `1px solid ${position.color}`,
                  color: `${position.color}`,
                  margin: '4px 0',
                }}
              >
                {position.name}
              </Tag>
              {/* <Tag color='pink'>태그</Tag> */}
            </>
          )}
        />
        <Column title="제목" dataIndex="title" key="title" />
        <Column
          title="길이"
          dataIndex="runTime"
          key="runTime"
          render={(runTime) => {
            const minutes = Math.floor(runTime / 60);
            const seconds = runTime % 60;
            if (runTime >= 60) {
              return (
                <Tag color="red">
                  {minutes}분 {seconds}초
                </Tag>
              );
            }
            return <Tag color="red">{runTime}초</Tag>;
          }}
        />
        <Column
          title="일시"
          dataIndex="dateTime"
          key="dateTime"
          render={(dateTime) => (
            <>
              <Tag color="blue">{dateTime.date}</Tag>
              <Tag color="green">{dateTime.time}</Tag>
            </>
          )}
        />
      </Table>
    </>
  );
}
