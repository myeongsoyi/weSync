'use client';

import { Table, Tag } from 'antd';
// import { getMainRecords } from '@/services/home';

interface IParams {
  records: {
    id: number;
    teamImage: string;
    songName: string;
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
  const { Column, ColumnGroup } = Table;
  console.log(records);
  return (
    <>
      <Table dataSource={records} pagination={false}>
        <Column title="곡명" dataIndex="songName" key="songName" />
        <Column
          title="포지션"
          dataIndex="position"
          key="position"
          render={(position) => (
            <>
              <Tag
                style={{
                  border: `1px solid ${position.color}`,
                  color: `${position.color}`,
                  margin: '4px 0px',
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
