'use client';
import React from 'react';
import { EditFilled } from '@ant-design/icons';
import { Button, Tooltip, message } from 'antd';
import Swal from 'sweetalert2';
import { postTeamNotice } from '@/services/team/notice';

interface NoticeWriteProps {
  teamId: string;
  fetchNotices: () => void;
}

const NoticeWrite: React.FC<NoticeWriteProps> = ({ teamId, fetchNotices }) => {
  const handlePrompt = () => {
    Swal.fire({
      title: '공지 작성',
      input: 'textarea',
      inputPlaceholder: '글을 작성해주세요.',
      showCancelButton: true,
      confirmButtonText: '등록',
      cancelButtonText: '취소',
      inputValidator: (value) => {
        if (!value) {
          return '내용을 입력해주세요!';
        }
        return null;
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const contentWithLineBreaks = result.value.replace(/\n/g, '<br />');
        const response = await postTeamNotice(teamId, contentWithLineBreaks);
        if (response.success) {
          Swal.fire('등록완료', '글이 등록되었습니다', 'success').then(() => {
            fetchNotices(); // 공지를 다시 가져옴
          });
        } else {
          Swal.fire('등록실패', '글 등록에 실패했습니다', 'error');
        }
      } else {
        message.error('글 작성이 취소되었습니다.');
      }
    });
  };

  return (
    <Tooltip placement="top" title={'글 작성하기'} arrow={true}>
      <div className="p-8">
        <Button
          onClick={handlePrompt}
          type="text"
          icon={<EditFilled style={{ fontSize: 24 }} />}
          style={{ width: 48 }}
        />
      </div>
    </Tooltip>
  );
};

export default NoticeWrite;
