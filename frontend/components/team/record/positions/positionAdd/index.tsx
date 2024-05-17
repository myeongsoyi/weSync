'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './index.module.scss';
import { EditOutlined } from '@ant-design/icons';
import { Button, Slider, Tag } from 'antd';
import PositionModal from '../positionBox/scorePositionModal';

interface IRecord {
  id: number;
  name?: string;
  color?: string;
  isMute: boolean;
  volume: number;
  savedVolume: number;
}

export default function PositionAdd() {
  const [count, setCount] = useState<number>(0);
  const [positions, setPositions] = useState<IRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPositionId, setSelectedPositionId] = useState<number | null>(null);

  const handleIncreaseCount = () => {
    setCount(count + 1);
    setPositions((prev) => [
      ...prev,
      { id: count, isMute: false, volume: 30, savedVolume: 0 },
    ]);
  };

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

  const openModal = (positionId: number) => {
    setSelectedPositionId(positionId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPositionId(null);
  };

  const handlePositionSelect = (positionName: string, color: string) => {
    if (selectedPositionId !== null) {
      setPositions((prev) =>
        prev.map((pos) =>
          pos.id === selectedPositionId
            ? { ...pos, name: positionName, color }
            : pos,
        ),
      );
    }
    closeModal();
  };

  return (
    <>
      {positions.map((position) => (
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
            {position.name ? (
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
                {position.name}
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
