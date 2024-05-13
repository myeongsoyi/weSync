'use client';

import React from 'react';
import { EditFilled } from '@ant-design/icons';
import { Button, Tooltip, message } from 'antd';
import Swal from 'sweetalert2';

export default function NoticeWrite() {
  // 입력 폼이 있는 알림
  const handlePrompt = () => {
    Swal.fire({
      title: '글 작성',
      input: 'textarea',
      inputPlaceholder: '글을 작성해주세요.',
      showCancelButton: true,
      confirmButtonText: '등록',
      cancelButtonText: '취소',
      inputValidator: (value) => {
        if (!value) {
          return '내용을 입력해주세요!';
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('등록됨', '글이 등록되었습니다', 'success');
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
}
