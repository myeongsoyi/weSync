'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Modal, List, Tag, Button, message, Tooltip } from 'antd';
import {
  ExclamationCircleOutlined,
  PlusCircleOutlined,
  FormOutlined,
  DeleteOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import NewPositionModal from './newpositionmodal';
import { useTeamPositionStore } from '@/store/teamPositionStore';
import {
  getTeamPosition,
  putMemberPosition,
} from '@/services/team/information';

interface Position {
  positionId: number;
  positionName: string;
  colorCode: string;
  colorId: number;
}

// const initialPositions: Position[] = [
//   { name: '소프라노', color: '#f50' },
//   { name: '알토', color: '#2db7f5' },
//   { name: '바리톤', color: '#87d068' },
//   { name: '테너', color: '#108ee9' },
// ];

export default function PositionModal({
  open,
  onOk,
  onCancel,
  selectedMemberId,
}: {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  selectedMemberId: number | null;
}) {
  // const [positions, setPositions] = useState<Position[]>(initialPositions);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(
    selectedMemberId,
  );
  const [newPositionVisible, setNewPositionVisible] = useState<boolean>(false);

  const { positions, setPositions, addPosition, deletePosition } =
    useTeamPositionStore((state) => ({
      positions: state.positions,
      setPositions: state.setPositions,
      addPosition: state.addPosition,
      deletePosition: state.deletePosition,
    }));

  const teamId = usePathname().split('/')[2];

  useEffect(() => {
    const fetchPositions = async () => {
      // console.log('fetching positions')
      const positions = await getTeamPosition(teamId);
      console.log(positions);
      if (positions.success) {
        setPositions(positions.data);
      }
    };
    fetchPositions();
  }, [open]);

  const handlePositionSelect = (positionId: number): void => {
    setSelectedPosition(positionId);
  };

  const handleDelete = (positionId: number, positionName: string): void => {
    Modal.confirm({
      title: '정말로 삭제하시겠습니까?',
      content: `${positionName}을 삭제하시겠습니까?`,
      icon: <ExclamationCircleOutlined />,
      okText: '예',
      okType: 'danger',
      cancelText: '아니요',
      onOk() {
        deletePosition(positionId);
        message.success(`${positionName}이(가) 삭제되었습니다.`);
      },
    });
  };

  const modifyDelete = (positionId: number, positionName: string) => (
    <div style={{ display: 'flex' }}>
      {' '}
      {/* 가로 배치를 위한 flex 컨테이너 추가 */}
      <Button
        style={{
          width: '15px',
          height: '25px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: '8px', // 버튼 사이 간격
          borderColor: '#1890ff', // 테두리 색상을 흰색으로 설정
        }}
      >
        <FormOutlined style={{ fontSize: '15px', color: '#1890ff' }} />
      </Button>
      <Button
        danger
        onClick={() => handleDelete(positionId, positionName)}
        style={{
          width: '15px',
          height: '25px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <DeleteOutlined style={{ fontSize: '15px' }} />
      </Button>
    </div>
  );

  const handleOk = async () => {
    if (!selectedPosition) {
      message.error('포지션을 선택해 주세요.');
      return;
    } else if (selectedMemberId) {
      const response = await putMemberPosition(
        selectedMemberId,
        selectedPosition,
      );
      if (response.success) {
        message.success('포지션 변경이 완료되었습니다.');
        onOk();
      } else {
        message.error('포지션 변경에 실패했습니다.');
      }
    } else {
      message.error('멤버를 다시 선택해 주세요.');
    }
  };

  return (
    <Modal
      title={
        <div style={{ textAlign: 'center', fontSize: '20px' }}>
          포지션 변경하기
        </div>
      }
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      width={450}
      closable={false}
      footer={
        <div style={{ textAlign: 'center', width: '100%' }}>
          <Button
            key="back"
            onClick={onCancel}
            style={{ marginRight: 8, color: 'gray', fontWeight: 'bold' }}
          >
            취소
          </Button>
          <Button
            key="submit"
            onClick={handleOk}
            style={{
              backgroundColor: '#FFC500',
              fontWeight: 'bold',
              border: 'none',
            }}
          >
            확인
          </Button>
        </div>
      }
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <List
          dataSource={positions}
          renderItem={({ positionId, positionName, colorCode }: Position) => (
            <List.Item
              style={{
                justifyContent: 'center',
                display: 'flex',
                margin: '2px 0',
                padding: '4px 0',
              }}
              onClick={() => handlePositionSelect(positionId)}
            >
              <Tooltip
                title={modifyDelete(positionId, positionName)}
                color="white"
                arrow={false}
                overlayInnerStyle={{
                  borderColor: 'lightgray',
                  borderWidth: 3,
                  borderStyle: 'solid',
                }}
                placement="right"
              >
                <Tag
                  style={{
                    cursor: 'pointer',
                    padding:
                      selectedPosition === positionId ? '4px 8px' : '1px 5px',
                    fontSize: `calc(15px * ${selectedPosition === positionId ? '1.5' : '1'})`,
                    fontWeight:
                      selectedPosition === positionId ? 'bold' : 'normal',
                    borderWidth: `calc(1px * ${selectedPosition === positionId ? '3' : '1'})`,
                    margin: `calc(0px + ${selectedPosition === positionId ? '8px' : '0px'}) auto`,
                    borderColor: `#${colorCode}`,
                    color: `#${colorCode}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative', // 위치 조정을 위해 relative 설정
                  }}
                  className={
                    selectedPosition === positionId ? 'selectedTag' : ''
                  }
                >
                  {selectedPosition === positionId && (
                    <CheckOutlined
                      style={{
                        position: 'absolute',
                        left: '-30px', // 체크 아이콘 위치 조정
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '20px',
                        color: 'green', // 체크 아이콘 색상
                      }}
                    />
                  )}
                  {positionName}
                </Tag>
              </Tooltip>
            </List.Item>
          )}
          size="small"
          split={false}
        />
        <Button
          type="link"
          onClick={() => setNewPositionVisible(true)}
          style={{ margin: 10, color: 'gray' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '17px',
            }}
          >
            <PlusCircleOutlined style={{ marginRight: 8 }} />
            새로운 포지션 생성
          </div>
        </Button>
      </div>
      <NewPositionModal
        open={newPositionVisible}
        onCancel={() => setNewPositionVisible(false)}
        onSuccess={(
          positionId: number,
          newPosition: string,
          colorCode: string,
          colorId: number,
        ) => {
          addPosition(positionId, newPosition, colorCode, colorId);
          setNewPositionVisible(false);
        }}
        teamId={teamId}
      />
    </Modal>
  );
}
