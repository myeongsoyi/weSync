import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, List, message, Space, Tooltip, Avatar } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import LocalStorage from '@/utils/localStorage';
import {
  getFeedbacks,
  postFeedback,
  deleteFeedback,
  putFeedback,
} from '@/services/team/workspace';
import Swal from 'sweetalert2';

interface IComment {
  feedbackId: number; // 피드백 id
  content: string; // 피드백 내용
  userId: number; // 피드백 생성한 팀원 id
  nickname: string; // 피드백 생성한 팀원 닉네임
  profileImg: string; // 피드백 생성한 팀원 프로필 이미지 주소
  createdAt: string; // 피드백 생성시간
  updatedAt: string; // 피드백 수정시간 (수정 안했으면 null)
}

interface ICommentModalProps {
  open: boolean;
  onClose: () => void;
  songId: number;
  songTitle: string; // 음원 제목을 포함하는 새로운 prop
  teamId: string;
}

export default function CommentModal({
  open,
  onClose,
  songTitle,
  songId,
  teamId,
}: ICommentModalProps) {
  const [success, setSuccess] = useState<boolean>(true);
  const [comments, setComments] = useState<IComment[]>([]);
  const [error, setError] = useState<{
    errorCode: string;
    errorMessage: string;
  } | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  const myId = parseInt(LocalStorage.getItem('memberId') ?? '0');

  const fetchComments = async () => {
    const response = await getFeedbacks(songId);
    if (response.success) {
      setSuccess(response.success);
      setComments(response.data);
    } else {
      setSuccess(response.success);
      setError(response.error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchComments();
    }
  }, [open]);

  const handleDeleteComment = async (feedbackId: number, comment: string) => {
    Swal.fire({
      title: '정말 삭제하시겠습니까?',
      text: comment,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deleteFeedback(feedbackId);
        if (!response.success) {
          message.error(
            response.error.errorMessage || '댓글 삭제에 실패했습니다.',
          );
          return;
        } else {
          message.success('댓글이 삭제되었습니다.');
          fetchComments();
        }
      }
    });
  };

  const handleEditComment = async (feedbackId: number, content: string) => {
    Swal.fire({
      title: '댓글 수정',
      input: 'textarea',
      inputLabel: '댓글 내용을 수정하세요',
      inputValue: content,
      showCancelButton: true,
      confirmButtonText: '수정',
      cancelButtonText: '취소',
      inputValidator: (value) => {
        if (!value) {
          return '댓글을 입력하세요.';
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        const response = await putFeedback(feedbackId, result.value);
        if (!response.success) {
          message.error(
            response.error.errorMessage || '댓글 수정에 실패했습니다.',
          );
          return;
        } else {
          message.success('댓글이 수정되었습니다.');
          fetchComments();
        }
      }
    });
  };

  const handleAddComment = async () => {
    if (!newCommentText.trim()) {
      message.error('댓글을 입력하세요.');
      return;
    }

    const response = await postFeedback(teamId, songId, newCommentText);
    if (!response.success) {
      message.error(response.error.errorMessage || '댓글 등록에 실패했습니다.');
      return;
    } else {
      setNewCommentText('');
      message.success('댓글이 등록되었습니다.');
      fetchComments();
    }
  };

  if (!success) {
    return <p>{error?.errorMessage}</p>;
  }

  return (
    <Modal
      title={`'${songTitle}'의 댓글`}
      open={open}
      onCancel={() => {
        onClose();
        setNewCommentText('');
      }}
      footer={null}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ width: '100%' }}>
          <Input
            placeholder="댓글을 입력하세요"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            style={{ width: '85%', marginRight: '8px' }}
          />
          <Button
            onClick={handleAddComment}
            style={{
              backgroundColor: '#FFC500',
              borderColor: '#FFC500',
              color: 'black',
              fontWeight: 'bold',
            }}
            disabled={!newCommentText.trim()}
          >
            등록
          </Button>
        </div>
        <List
          dataSource={comments}
          renderItem={(item) => (
            <List.Item>
              <div className="flex w-full">
                <div className="w-full">
                  <div className='mb-2'>
                    <Avatar src={item.profileImg} alt='카카오프로필' size={40} ></Avatar>
                    <strong className='ml-2'>{item.nickname}</strong>
                    </div>
                  <p>{item.content}</p>
                </div>
                <div className="max-w-10 justify-center flex flex-col">
                  {myId === item.userId && (
                    <div className='m-auto'>
                      <Tooltip title="수정" placement="top">
                        <EditOutlined
                          style={{
                            color: 'blue',
                            fontSize: 18,
                            marginBottom: 12,
                          }}
                          onClick={() =>
                            handleEditComment(item.feedbackId, item.content)
                          }
                        />
                      </Tooltip>
                      <Tooltip title="삭제" placement="top">
                        <DeleteOutlined
                          style={{ color: 'red', fontSize: 18 }}
                          onClick={() =>
                            handleDeleteComment(item.feedbackId, item.content)
                          }
                        />
                      </Tooltip>
                    </div>
                  )}
                </div>
              </div>
            </List.Item>
          )}
        />
      </Space>
    </Modal>
  );
}
