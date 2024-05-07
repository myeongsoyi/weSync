import React, { useState } from 'react';
import { Modal, List, Tag, Button, message } from 'antd';
import NewPositionModal from './newpositionmodal';
import { PlusCircleOutlined } from '@ant-design/icons';

interface Position {
  name: string;
  color: string;
}

const initialPositions: Position[] = [
  { name: '소프라노', color: '#f50' },
  { name: '알토', color: '#2db7f5' },
  { name: '바리톤', color: '#87d068' },
  { name: '테너', color: '#108ee9' },
];

export default function PositionModal({
  open,
  onOk,
  onCancel,
}: {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}) {
  const [positions, setPositions] = useState<Position[]>(initialPositions);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [newPositionVisible, setNewPositionVisible] = useState<boolean>(false);

  const handlePositionSelect = (position: string) => {
    setSelectedPosition(position);
  };

  const handleOk = async () => {
    if (!selectedPosition) {
      message.error('포지션을 선택해 주세요.');
      return;
    }
    try {
      const response = await fetch('/api/assignPosition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ position: selectedPosition }),
      });
      if (!response.ok) throw new Error('네트워크 오류 발생');
      message.success(`${selectedPosition} 포지션이 할당되었습니다.`);
      onOk();
    } catch (error) {
      message.error(`${selectedPosition} 포지션 할당이 실패하였습니다.`);
    }
  };

  return (
    <Modal
      title={<div style={{ textAlign: 'center', fontSize: '20px' }}>포지션 변경하기</div>}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      width={400}
      closable={false}
      footer={[
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Button key="back" onClick={onCancel} style={{ marginRight: 8 }}>
            취소
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            확인
          </Button>
        </div>,
      ]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <List
          dataSource={positions}
          renderItem={({ name, color }) => (
            <List.Item
              style={{
                justifyContent: 'center',
                display: 'flex',
                margin: '2px 0',
                padding: '4px 0',
              }}
              onClick={() => handlePositionSelect(name)}
            >
              <Tag
                style={{
                  cursor: 'pointer',
                  padding: selectedPosition === name ? '5px 6px' : '3px 4px',
                  fontSize: selectedPosition === name ? '25px' : '15px',
                  fontWeight: selectedPosition === name ? 'bold' : 'normal',
                  borderWidth: selectedPosition === name ? '3px' : '1px',
                  borderColor: color,
                  color: color,
                }}
              >
                {name}
              </Tag>
            </List.Item>
          )}
          size="small"
          split={false}
        />
        <Button
          type="link"
          onClick={() => setNewPositionVisible(true)}
          style={{ marginTop: 10, color: 'gray' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PlusCircleOutlined style={{ marginRight: 8 }} />
            새로운 포지션 생성
          </div>
        </Button>
      </div>
      <NewPositionModal
        open={newPositionVisible}
        onCancel={() => setNewPositionVisible(false)}
        onSuccess={(newPosition: string, newColor: string = 'blue') => {
          setPositions([...positions, { name: newPosition, color: newColor }]);
          setNewPositionVisible(false);
        }}
      />
    </Modal>
  );
}
