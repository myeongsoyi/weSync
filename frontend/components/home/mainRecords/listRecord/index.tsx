'use client';

import React, { useState, useEffect } from 'react';
import { Avatar, Table, Tag, message } from 'antd';
import { MainRecords } from '@/types/homeMain';
import { getMainRecords } from '@/services/home';

export default function ListRecord() {
  const [success, setSuccess] = useState<MainRecords['success']>(true);
  const [records, setRecords] = useState<MainRecords['data']>([]);
  const [error, setError] = useState<MainRecords['error']>(null);

  const { Column } = Table;

  // useEffect(() => {
  //   const fetchRecords = async () => {
  //     try {
  //       const response = await getMainRecords();
  //       if (response.success) {
  //         setRecords(response.data);
  //         setSuccess(true);
  //       } else {
  //         setError(response.error);
  //         setSuccess(false);
  //       }
  //     } catch (err) {
  //       message.error('데이터를 불러오는데 실패했습니다.');
  //     }
  //   };
  //   fetchRecords();
  // }, []);

  useEffect(() => {
    setRecords([
      {
        recordId: 1,
        title: '안녕',
        isPublic: true,
        recordUrl: 'https://we-sync.s3.ap-southeast-2.amazonaws.com/record/m2.mp3',
        teamId: 1,
        teamUrl: 'https://we-sync.s3.ap-southeast-2.amazonaws.com/front/3d-render-of-red-paper-clipboard-with-cross-mark.png',
        songName: '노래1',
        positionName: '포지션1',
        colorCode: 'FFE27F',
        startAt: 1.5,
        endAt: 12.5,
        createAt: '2024-05-12T02:45:33.926036',
      },
    ]);
  }, []);

  if (!success) {
    return (
      <div>
        <h2>데이터를 불러오는데 실패했습니다.</h2>
        <h2>{error?.errorMessage}</h2>
      </div>
    );
  }

  return (
    <Table dataSource={records} pagination={false} rowKey="recordId">
      <Column title="노래" dataIndex="songName" key="songName" 
      render={(songName, record: MainRecords['data'][number]) => 
        <>
        <Avatar src={record.teamUrl}  alt="팀"
        size={40}
        style={{ borderColor: '#FFC500', marginRight: '1rem' }} />
        <span>{songName}</span>
        </>
      } />
      <Column
        title="포지션"
        key="positionName"
        render={(record: MainRecords['data'][number]) => (
          <Tag
            style={{
              border: `1px solid #${record.colorCode}`,
              color: `#${record.colorCode}`,
              margin: '4px 0px',
            }}
          >
            {record.positionName}
          </Tag>
        )}
      />
      <Column title="제목" dataIndex="title" key="title" />
      <Column
        title="길이"
        key="runTime"
        render={(record: MainRecords['data'][number]) => {
          const runTime = record.endAt - record.startAt;
          const minutes = Math.floor(runTime / 60);
          const seconds = Math.floor(runTime % 60);
          return runTime >= 60 ? (
            <Tag color="red">
              {minutes}분 {seconds}초
            </Tag>
          ) : (
            <Tag color="red">{runTime}초</Tag>
          );
        }}
      />
      <Column
        title="저장 일시"
        dataIndex="createAt"
        key="createAt"
        render={(createAt: string) => {
          const date = new Date(createAt);
          const formattedDate = date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'Asia/Seoul'
          });
          const formattedTime = date.toLocaleTimeString('ko-KR', {
            hour: 'numeric',
            minute: '2-digit',
            // second: '2-digit',
            timeZone: 'Asia/Seoul'
          });
          return (
            <>
              <Tag color="blue">{formattedDate}</Tag>
              <Tag color="green">{formattedTime}</Tag>
            </>
          );
        }}
      />
    </Table>
  );
}
