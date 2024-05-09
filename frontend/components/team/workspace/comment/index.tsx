import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, List, Popconfirm, message, Space } from 'antd';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';

interface IComment {
  id: number;
  text: string;
  author: string;
}

interface ICommentModalProps {
  open: boolean;
  onClose: () => void;
  songId: number;
  songTitle: string; // 음원 제목을 포함하는 새로운 prop
}

const initialComments: IComment[] = [
  { id: 1, text: '정말 멋진 곡이네요!', author: '홍길동' },
  { id: 2, text: '이 부분이 제일 좋아요.', author: '김철수' },
];

export default function CommentModal({
  open,
  onClose,
  songId,
  songTitle,
}: ICommentModalProps) {
  const [comments, setComments] = useState<IComment[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [newCommentText, setNewCommentText] = useState('');

  const currentUser = '현재 사용자'; // 실제 애플리케이션에서는 로그인 된 사용자 정보를 사용해야 함

  useEffect(() => {
    if (open) {
      setComments(initialComments); // API 대신 더미 데이터 로드
    }
  }, [open]);

  const handleDeleteComment = (id: number) => {
    setComments(comments.filter((comment) => comment.id !== id));
    message.success('댓글이 삭제되었습니다.');
  };

  const handleEditComment = (id: number) => {
    const comment = comments.find((comment) => comment.id === id);
    if (comment) {
      setEditId(id);
      setEditText(comment.text);
    }
  };

  const handleSaveEdit = () => {
    setComments(
      comments.map((comment) =>
        comment.id === editId ? { ...comment, text: editText } : comment,
      ),
    );
    setEditId(null);
    setEditText('');
    message.success('댓글이 수정되었습니다.');
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) {
      message.error('댓글을 입력하세요.');
      return;
    }
    const newComment = {
      id: Math.max(...comments.map((c) => c.id)) + 1,
      text: newCommentText,
      author: currentUser,
    };
    setComments([...comments, newComment]);
    setNewCommentText('');
    message.success('댓글이 등록되었습니다.');
  };

  const renderCommentActions = (comment: IComment) =>
    comment.author === currentUser
      ? [
          <Button
            icon={<FormOutlined style={{ color: '#1890ff' }} />}
            onClick={() => handleEditComment(comment.id)}
            style={{
              borderColor: '#1890ff',
            }}
          />,
          <Popconfirm
            title="정말 삭제하시겠습니까?"
            onConfirm={() => handleDeleteComment(comment.id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>,
        ]
      : [];

  return (
    <Modal
      title={`'${songTitle}'의 댓글`}
      open={open}
      onCancel={() => {
        onClose();
        setEditId(null);
        setEditText('');
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
            <List.Item
              actions={
                editId === item.id ? undefined : renderCommentActions(item)
              }
            >
              {editId === item.id ? (
                <div style={{ width: '100%' }}>
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    style={{ width: '85%', marginRight: '8px' }}
                  />
                  <Button
                    onClick={handleSaveEdit}
                    style={{
                      backgroundColor: '#FFC500',
                      borderColor: '#FFC500',
                      fontWeight: 'bold'
                    }}
                  >
                    수정
                  </Button>
                </div>
              ) : (
                <div>
                  <strong>{item.author}</strong>
                  <p>{item.text}</p>
                </div>
              )}
            </List.Item>
          )}
        />
      </Space>
    </Modal>
  );
}
