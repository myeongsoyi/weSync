'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './index.module.scss';
import { EditOutlined } from '@ant-design/icons';
import { Button, Slider, Tag } from 'antd';
import PositionModal from '../positionBox/scorePositionModal'; // PositionModal import

// 포지션 타입 정의
interface IPosition {
  id: number;
  isMute: boolean;
  volume: number;
  savedVolume: number;
  positionName?: string;
  color?: string;
}

export default function PositionAdd() {
  const [count, setCount] = useState<number>(1); // 초기 값을 1로 설정하여 기본 포지션 할당 버튼 생성
  const [positions, setPositions] = useState<IPosition[]>([
    { id: 0, isMute: false, volume: 30, savedVolume: 0 },
  ]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPositionId, setSelectedPositionId] = useState<number | null>(null);

  // 카운트 증가 및 포지션 추가 함수
  const handleIncreaseCount = () => {
    setCount(count + 1);
    setPositions((prev) => [
      ...prev,
      { id: count, isMute: false, volume: 30, savedVolume: 0 },
    ]);
  };

  // 포지션 할당 상태 토글 함수
  const togglePosition = (id: number) => {
    setPositions((prev) =>
      prev.map((pos) =>
        pos.id === id
          ? pos.isMute
            ? {
                ...pos,
                isMute: !pos.isMute,
                volume: pos.savedVolume,
                savedVolume: 0,
              }
            : {
                ...pos,
                isMute: !pos.isMute,
                volume: pos.savedVolume,
                savedVolume: pos.volume,
              }
          : pos,
      ),
    );
  };

  // 모달 열기 함수
  const openModal = (positionId: number) => {
    setSelectedPositionId(positionId);
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPositionId(null);
  };

  // 포지션 선택 핸들러
  const handlePositionSelect = (positionName: string, color: string) => {
    if (selectedPositionId !== null) {
      setPositions((prev) =>
        prev.map((pos) =>
          pos.id === selectedPositionId
            ? { ...pos, positionName, color }
            : pos,
        ),
      );
    }
    closeModal();
  };

  return (
    <>
      {positions.map((position: IPosition) => (
        <div className={styles.controller} key={position.id}>
          <Button
            onClick={() => togglePosition(position.id)}
            type="text"
            style={{
              padding: '1px',
              width: '20%',
              margin: 'auto',
              height: 'auto',
            }}
          >
            {!position.isMute ? (
              <Image
                src={'/svgs/volume_on.svg'}
                alt="볼륨온"
                width={50}
                height={50}
              />
            ) : (
              <Image
                src={'/svgs/volume_mute.svg'}
                alt="볼륨오프"
                width={50}
                height={50}
              />
            )}
          </Button>
          <div className={styles.box_slider}>
            {position.positionName ? (
              <Tag
                onClick={() => openModal(position.id)}
                style={{
                  color: position.color || 'defaultColor',
                  borderColor: position.color || 'defaultBorderColor',
                  fontSize: 17,
                  width: 'auto',
                  padding: '2px 4px',
                  textAlign: 'center',
                  marginTop: 10,
                  cursor: 'pointer',
                }}
              >
                {position.positionName}
              </Tag>
            ) : (
              <Button
                type="text"
                onClick={() => openModal(position.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 17,
                  fontWeight: 'bold',
                  width: 'auto',
                  padding: '4px 8px',
                  marginTop: 10,
                }}
              >
                <EditOutlined />
                <span>포지션 할당</span>
              </Button>
            )}
            <Slider
              defaultValue={30}
              value={position.volume}
              onChange={(value) => {
                setPositions((prev) =>
                  prev.map((pos) =>
                    pos.id === position.id
                      ? { ...pos, isMute: false, volume: value, savedVolume: 0 }
                      : pos,
                  ),
                );
              }}
              style={{ width: '100%', marginTop: '10px' }}
            />
          </div>
        </div>
      ))}

      <div className={styles.controller}>
        <Button
          onClick={handleIncreaseCount}
          type="text"
          style={{ height: 'auto' }}
        >
          <h1>Count: {count}</h1>
        </Button>
      </div>

      <PositionModal
        open={isModalOpen}
        onOk={handlePositionSelect}
        onCancel={closeModal}
        selectedMemberId={null}
      />
    </>
  );
}
