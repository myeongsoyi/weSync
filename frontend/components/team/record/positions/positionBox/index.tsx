'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './index.module.scss';
import { EditOutlined } from '@ant-design/icons';
import { Button, Slider, Tag } from 'antd';
import PositionModal from './scorePositionModal';

interface IParams {
  teamId: string;
  position: IRecord;
}

interface IRecord {
  id: number;
  name?: string;
  color?: string;
  isMute: boolean;
  volume: number;
  savedVolume: number;
}

export default function PositionBox({
  teamId,
  position: initialPosition,
}: IParams) {
  const [isMute, setIsMute] = useState(initialPosition.isMute);
  const [volume, setVolume] = useState(initialPosition.volume);
  const [savedVolume, setSavedVolume] = useState(initialPosition.savedVolume);
  const [position, setPosition] = useState<IRecord>(initialPosition);
  const [positionModalOpen, setPositionModalOpen] = useState(false);

  const selectedMemberId = teamId ? parseInt(teamId) : null;

  const handlePositionSelect = (positionName: string, color: string) => {
    setPosition((prev) => ({
      ...prev,
      name: positionName,
      color: color,
    }));
    closePositionModal();
  };

  const handleOk = () => {
    if (position) {
      handlePositionSelect(position.name || '', position.color || '');
    }
    closePositionModal();
  };

  function openPositionModal() {
    setPositionModalOpen(true);
  }

  function closePositionModal() {
    setPositionModalOpen(false);
  }

  function changeVolume(value: number) {
    setIsMute(false);
    setVolume(value);
    setPosition((prev) => ({
      ...prev,
      volume: value,
      savedVolume: 0,
    }));
  }

  function clickMute() {
    if (isMute) {
      setVolume(savedVolume);
      setPosition((prev) => ({
        ...prev,
        isMute: false,
        volume: savedVolume,
        savedVolume: 0,
      }));
    } else {
      setSavedVolume(volume);
      setVolume(0);
      setPosition((prev) => ({
        ...prev,
        isMute: true,
        volume: 0,
        savedVolume: volume,
      }));
    }
    setIsMute(!isMute);
  }

  return (
    <div className={styles.controller}>
      <div className={styles.muteButtonWrapper}>
        <Button
          onClick={clickMute}
          type="text"
          style={{ padding: '1px', width: '50px', height: 'auto' }}
        >
          {!isMute ? (
            <Image
              src={'/svgs/volume_on.svg'}
              alt="Volume On"
              width={50}
              height={50}
            />
          ) : (
            <Image
              src={'/svgs/volume_mute.svg'}
              alt="Volume Off"
              width={50}
              height={50}
            />
          )}
        </Button>
      </div>
      <div className={styles.box_slider}>
        {position.name ? (
          <Tag
            onClick={openPositionModal}
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
            onClick={openPositionModal}
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
          value={volume}
          onChange={changeVolume}
          style={{ width: '100%', marginTop: '10px' }}
        />
      </div>
      <PositionModal
        open={positionModalOpen}
        onOk={handlePositionSelect}
        onCancel={closePositionModal}
        selectedMemberId={selectedMemberId}
      />
    </div>
  );
}
