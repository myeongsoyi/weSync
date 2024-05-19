'use client';

import React, { useEffect, useState } from 'react';
import { Modal, List, Tag, Button, message, Tooltip } from 'antd';
import { ExclamationCircleOutlined, PlusCircleOutlined, FormOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { getTeamPosition, deleteTeamPosition, 
  // putMemberPosition 
} from '@/services/team/information';
import { usePathname } from 'next/navigation';
import UpdatePositionModal from '@/components/team/information/members/positionmodal/updatepositionmodal';
import NewPositionModal from '@/components/team/information/members/positionmodal/newpositionmodal';
import { useTeamPositionStore } from '@/store/teamPositionStore';
import { postScoreGetPosition } from '@/services/team/record';

interface Position {
  positionId: number;
  positionName: string;
  colorCode: string;
  colorId: number;
}

export default function PositionModal({
  open,
  onOk,
  onCancel,
  selectedMemberId
}: {
  open: boolean;
  onOk: (positionName: string, color: string) => void;
  onCancel: () => void;
  selectedMemberId: number | null;
}) {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [newPositionVisible, setNewPositionVisible] = useState<boolean>(false);
  const [updatePositionVisible, setUpdatePositionVisible] = useState<boolean>(false);

  const { positions, setPositions, getPositions } = useTeamPositionStore((state) => ({
    positions: state.positions,
    setPositions: state.setPositions,
    getPositions: state.getPositions,
  }));

  const teamId = usePathname().split('/')[2];

  useEffect(() => {
    const fetchPositions = async () => {
      const positions = await getTeamPosition(teamId);
      if (positions.success) {
        setPositions(positions.data);
      }
    };
    if (open) {
      fetchPositions();
    }
  }, [open]);

  const handlePositionSelect = (position: Position): void => {
    setSelectedPosition(position);
  };

  const handleDelete = (positionId: number, positionName: string): void => {
    Modal.confirm({
      title: '정말로 삭제하시겠습니까?',
      content: `${positionName}을(를) 삭제하시겠습니까?`,
      icon: <ExclamationCircleOutlined />,
      okText: '예',
      okType: 'danger',
      cancelText: '아니요',
      async onOk() {
        const response = await deleteTeamPosition(positionId);
        if (response.success) {
          message.success(`${positionName}이(가) 삭제되었습니다.`);
          getPositions(teamId);
          window.location.reload();
        } else {
          message.error('포지션 삭제에 실패했습니다.');
        }
      },
    });
  };

  const handleUpdatePosition = async (
    positionId: number,
    positionName: string,
    colorCode: string,
    colorId: number,
  ) => {
    setSelectedPosition({ positionId, positionName, colorCode, colorId });
    setUpdatePositionVisible(true);
  };

  const modifyDelete = (position: Position) => (
    <div style={{ display: 'flex' }}>
      <Button
        style={{
          width: '15px',
          height: '25px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: '8px',
          borderColor: '#1890ff',
        }}
        onClick={() =>
          handleUpdatePosition(position.positionId, position.positionName, position.colorCode, position.colorId)
        }
      >
        <FormOutlined style={{ fontSize: '15px', color: '#1890ff' }} />
      </Button>
      <Button
        danger
        onClick={() => handleDelete(position.positionId, position.positionName)}
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
    } else if (selectedMemberId !== null) {
      // console.warn(selectedMemberId, selectedPosition.positionId)
      const response = await postScoreGetPosition(selectedMemberId, selectedPosition.positionId);
      if (response.success) {
        message.success('포지션 할당이 완료되었습니다.');
        onOk(selectedPosition.positionName, `#${selectedPosition.colorCode}`);
      } else {
        message.error('포지션 할당에 실패했습니다.');
      }
    } else {
      message.error('악보를 다시 선택해 주세요.');
    }
  };

  return (
    <Modal
      title={<div style={{ textAlign: 'center', fontSize: '20px' }}>포지션 할당하기</div>}
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <List
          dataSource={positions}
          renderItem={(position: Position) => (
            <List.Item
              style={{
                justifyContent: 'center',
                display: 'flex',
                margin: '2px 0',
                padding: '4px 0',
              }}
              onClick={() => handlePositionSelect(position)}
            >
              <Tooltip
                title={modifyDelete(position)}
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
                    padding: selectedPosition?.positionId === position.positionId ? '4px 8px' : '1px 5px',
                    fontSize: `calc(15px * ${selectedPosition?.positionId === position.positionId ? '1.5' : '1'})`,
                    fontWeight: selectedPosition?.positionId === position.positionId ? 'bold' : 'normal',
                    borderWidth: `calc(1px * ${selectedPosition?.positionId === position.positionId ? '3' : '1'})`,
                    margin: `calc(0px + ${selectedPosition?.positionId === position.positionId ? '8px' : '0px'}) auto`,
                    borderColor: `#${position.colorCode}`,
                    color: `#${position.colorCode}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                  className={selectedPosition?.positionId === position.positionId ? 'selectedTag' : ''}
                >
                  {selectedPosition?.positionId === position.positionId && (
                    <CheckOutlined
                      style={{
                        position: 'absolute',
                        left: '-30px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '20px',
                        color: 'green',
                      }}
                    />
                  )}
                  {position.positionName}
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
        onSuccess={() => {
          getPositions(teamId);
          setNewPositionVisible(false);
        }}
        teamId={teamId}
      />
      {selectedPosition && (
        <UpdatePositionModal
          open={updatePositionVisible}
          onCancel={() => setUpdatePositionVisible(false)}
          onSuccess={() => {
            getPositions(teamId);
            setUpdatePositionVisible(false);
          }}
          teamId={teamId}
          positionId={selectedPosition.positionId}
          currentName={selectedPosition.positionName}
          currentColorCode={selectedPosition.colorCode}
          currentColorId={selectedPosition.colorId}
        />
      )}
    </Modal>
  );
}
