'use client';

import React, { useState, useEffect } from 'react';
import { Table, Tag } from 'antd';
// import { getMainRecords } from '@/services/home';
import { MainRecords } from '@/types/homeMain';

export default function ListRecord() {
  const [success, setSuccess] = useState<MainRecords['success']>(true);
  const [records, setRecords] = useState<MainRecords['data']>([]);
  const [error, setError] = useState<MainRecords['error']>(null);

  const { Column } = Table;

  // useEffect(() => {
  //   const fetchRecords = async () => {
  //     const records = await getMainRecords();
  //     setSuccess(records.success);
  //     setRecords(records.data);
  //     setError(records.error);
  //   };
  //   fetchRecords();
  // }, []);

  useEffect(() => {
    setSuccess(true);
    setError(null);
    setRecords([
      {
        recordId: 1,
        title: '안녕',
        recordUrl: 'www.naver.com',
        teamId: 1,
        teamUrl: '/svgs/logo.svg',
        songName: '노래1',
        positionName: '포지션1',
        colorCode: 'FFE27F',
        startAt: 1.5,
        endAt: 12.5,
        createAt: '2024-05-12T22:45:33.926036',
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
      <Column title="곡명" dataIndex="songName" key="songName" />
      <Column
        title="포지션"
        dataIndex="positionName"
        key="positionName"
        render={([positionName, colorCode]) => (
          <>
            <Tag
              style={{
                border: `1px solid #${colorCode}`,
                color: `#${colorCode}`,
                margin: '4px 0px',
              }}
            >
              {positionName}
            </Tag>
          </>
        )}
      />
      <Column title="제목" dataIndex="title" key="title" />
      <Column
        title="길이"
        dataIndex='endAt'
        key="runTime"
        render={([endAt, startAt]) => {
          const runTime = endAt - startAt;
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
        dataIndex="createAt"
        key="createAt"
        render={(createAt) => {
          const date = new Date(createAt);
          const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
          const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date
            .getMinutes()
            .toString()
            .padStart(
              2,
              '0',
            )}:${date.getSeconds().toString().padStart(2, '0')}`;
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
