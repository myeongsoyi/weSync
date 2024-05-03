'use client';

import { Card, Space, Button, Tooltip } from 'antd';
import { PushpinFilled } from '@ant-design/icons';

interface IParams {
  notices: {
    id: number;
    date: string;
    detail: string;
    pinned: boolean;
  }[];
}

export default function NoticeList({ notices }: IParams) {
  // console.log(notices);

  return (
    <Space
      direction="vertical"
      size={30}
      style={{ width: '100%', padding: '20px' }}
    >
      {notices.map((notice) => (
        <Card
          key={notice.id}
          title={notice.date} // 공지의 날짜를 제목으로 사용
          extra={
            notice.pinned ? (
              <Tooltip placement="top" title={'글 고정 해제'} arrow={true}>
              <Button
                type="text"
                icon={
                  <PushpinFilled
                    style={{ color: 'crimson', fontSize: '16px' }}
                  />
                }
              />
              </Tooltip>
            ) : (
              <Tooltip placement="top" title={'글 고정'} arrow={true}>
              <Button
                type="text"
                icon={
                  <PushpinFilled
                    style={{ color: 'lightgray', fontSize: '16px' }}
                  />
                }
              />
              </Tooltip>
            )
          }
          style={{ width: '100%', padding: '10px 0' }}
        >
          <div className="text-wrap">
            <h4
              className="text-center text-pretty"
              style={{ wordWrap: 'break-word', padding: '10PX 120px' }}
            >
              {notice.detail}
            </h4>
          </div>
        </Card>
      ))}
    </Space>
  );
}
