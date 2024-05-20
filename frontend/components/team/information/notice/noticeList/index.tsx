'use client';
import React, { useState, useEffect } from 'react';
import { Card, Space, Button, Tooltip, Pagination, message } from 'antd';
import { PushpinFilled, DeleteFilled } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { TeamNotices } from '@/types/teamDetail';
import { getTeamNotices, putChangeFixed, deleteNotice } from '@/services/team/notice';
import NoticeWrite from '../noticeWrite/noticeWrite';
import { DateNoticeTimeFormat } from '@/utils/format';

interface NoticeListProps {
  teamId: string;
}

const NoticeList: React.FC<NoticeListProps> = ({ teamId }) => {
  const [success, setSuccess] = useState<TeamNotices['success']>(true);
  const [noticeList, setNoticeList] = useState<TeamNotices['data']>([]);
  const [error, setError] = useState<TeamNotices['error']>(null);
  const [noticeLength, setNoticeLength] = useState<number>(1);

  const fetchNotices = async () => {
    const notices = await getTeamNotices(teamId);
    setSuccess(notices.success);
    setNoticeList(notices.data);
    setNoticeLength(notices.data.length);
    setError(notices.error);
    // console.log(notices.data);
  };

  const togglePin = async (noticeId: number) => {
    const response = await putChangeFixed(noticeId);
    if (response.success) {
      fetchNotices();
    } else {
      setError(response.error);
      message.error(response.error.errorMessage);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [teamId]);

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

  const handleDelete = async (noticeId: number) => {
    const response = await deleteNotice(noticeId);
    if (response.success) {
      message.success('삭제되었습니다.');
      fetchNotices();
    } else {
      // message.error(response.error.errorMessage);
      message.error('삭제 권한이 없습니다.');
    }
  };

  if (!success) {
    return (
      <div>
        <h2>공지사항을 불러오는데 실패했습니다.</h2>
        <h2>{error?.errorMessage}</h2>
      </div>
    );
  }

  return (
    <Space
      direction="vertical"
      size={30}
      style={{ width: '100%', padding: '20px' }}
    >
      {noticeList?.length === 0 ? (
        <Card
          title="공지사항"
          style={{ width: '100%', padding: '10px 0' }}
        >
          <div className="text-wrap">
            <h4
              className="text-center"
              style={{ wordWrap: 'break-word', padding: '10px 120px' }}
            >
              공지사항을 게시해주세요.
            </h4>
          </div>
        </Card>
      ) : (
        noticeList?.map((notice) => (
          <Card
            key={notice.noticeId}
            title={DateNoticeTimeFormat(notice.createdAt)}
            extra={
              <div>
                <Tooltip
                  placement="top"
                  title={notice.fixed ? '글 고정 해제' : '글 고정'}
                  arrow={true}
                >
                  <Button
                    type="text"
                    icon={
                      <PushpinFilled
                        style={{
                          color: notice.fixed ? 'crimson' : 'lightgray',
                          fontSize: '16px',
                        }}
                      />
                    }
                    onClick={() => togglePin(notice.noticeId)}
                  />
                </Tooltip>
                <Tooltip placement="top" title={'글 삭제'} arrow={true}>
                  <Button
                    type="text"
                    icon={
                      <DeleteFilled style={{ color: 'gray', fontSize: '16px' }} />
                    }
                    onClick={() => showDeleteConfirm(notice.noticeId)}
                    style={{ marginLeft: '0.5rem' }}
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
                dangerouslySetInnerHTML={{ __html: notice.content }}
              />
            </div>
          </Card>
        ))
      )}
      <div className="flex justify-between items-center px-2">
        <div style={{ width: 48, marginLeft: '0.75rem' }} />
        <Pagination
          defaultCurrent={1}
          total={noticeLength}
          pageSize={5}
          style={{ flex: 1, textAlign: 'center' }}
        />
        <NoticeWrite teamId={teamId} fetchNotices={fetchNotices} />
      </div>
    </Space>
  );
};

export default NoticeList;
