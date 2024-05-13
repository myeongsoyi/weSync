'use client'

// import React, { useState, useEffect } from 'react';
import React, { useState } from 'react';
import { Card, Space, Button, Tooltip } from 'antd';
import { PushpinFilled, DeleteFilled } from '@ant-design/icons';
import Swal from 'sweetalert2';

interface IParams {
  notices: {
    id: number;
    date: string;
    detail: string;
    pinned: boolean;
  }[];
}

export default function NoticeList({ notices }: IParams) {
  // 공지사항 목록의 상태를 관리합니다.
  const [noticeList, setNoticeList] = useState(notices);

  const togglePin = (noticeId: number) => {
    const updatedNotices = noticeList.map(notice =>
      notice.id === noticeId ? { ...notice, pinned: !notice.pinned } : notice
    );
    setNoticeList(updatedNotices);
  };

  const showDeleteConfirm = (noticeId: number) => {
    Swal.fire({
      title: '정말로 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: 'grey',
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(noticeId);
      }
    });
  };

  const handleDelete = (noticeId: number) => {
    console.log('Deleting notice with id:', noticeId);
    // 삭제 api
    setNoticeList(noticeList.filter(notice => notice.id !== noticeId));
  };

  return (
    <Space
      direction="vertical"
      size={30}
      style={{ width: '100%', padding: '20px' }}
    >
      {noticeList.map((notice) => (
        <Card
          key={notice.id}
          title={notice.date}
          extra={
            <div>
              <Tooltip placement="top" title={notice.pinned ? '글 고정 해제' : '글 고정'} arrow={true}>
                <Button
                  type="text"
                  icon={
                    <PushpinFilled
                      style={{ color: notice.pinned ? 'crimson' : 'lightgray', fontSize: '16px' }}
                    />
                  }
                  onClick={() => togglePin(notice.id)}
                />
              </Tooltip>
              <Tooltip placement="top" title={'글 삭제'} arrow={true}>
                <Button
                  type="text"
                  icon={
                    <DeleteFilled
                      style={{ color: 'gray', fontSize: '16px', marginLeft: '10px' }}
                    />
                  }
                  onClick={() => showDeleteConfirm(notice.id)}
                />
              </Tooltip>
            </div>
          }
          style={{ width: '100%', padding: '10px 0' }}
        >
          <div className="text-wrap">
            <h4
              className="text-center text-pretty"
              style={{ wordWrap: 'break-word', padding: '10px 120px' }}
            >
              {notice.detail}
            </h4>
          </div>
        </Card>
      ))}
    </Space>
  );
}
