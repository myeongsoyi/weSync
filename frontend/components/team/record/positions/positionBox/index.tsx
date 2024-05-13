'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './index.module.scss';
import { EditOutlined } from '@ant-design/icons';
import { Button, Slider, Tag } from 'antd';
import { IRecord } from '@/services/team/record';
import PositionModal from '@/components/team/information/members/positionmodal/changemodal';

interface IParams {
  teamId: string;
  position: IRecord;
}

export default function PositionBox({ teamId, position: initialPosition }: IParams) {
  const [isMute, setIsMute] = useState(false);
  const [volume, setVolume] = useState(30);
  const [savedVolume, setSavedVolume] = useState(30);
  const [position, setPosition] = useState<IRecord>(initialPosition);
  const [positionModalOpen, setPositionModalOpen] = useState(false);
  console.log(teamId);
  const handlePositionSelect = (selectedPosition: IRecord) => {
    setPosition(selectedPosition);
    closePositionModal();
  };

  const handleOk = () => {
    if (position) {
      handlePositionSelect(position);
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
  }

  function clickMute() {
    if (isMute) {
      setVolume(savedVolume);
    } else {
      setSavedVolume(volume);
      setVolume(0);
    }
    setIsMute(!isMute);
  }

  return (
    <div className={styles.controller}>
      <Button onClick={clickMute} type="text" style={{ padding: '1px', width: '20%', margin: 'auto', height: 'auto' }}>
        {!isMute ? (
          <Image src={'/svgs/volume_on.svg'} alt="Volume On" width={50} height={50} />
        ) : (
          <Image src={'/svgs/volume_mute.svg'} alt="Volume Off" width={50} height={50} />
        )}
      </Button>
      <div className={styles.box_slider}>
        {position.name ? (
          <Tag style={{ color: position.color || 'defaultColor', borderColor: position.color || 'defaultBorderColor', fontSize: 15, width: '100%', padding: 4, textAlign: 'center', marginTop: 10 }}>
            {position.name}
          </Tag>
        ) : (
          <Button type="text" onClick={openPositionModal}>
            <EditOutlined /> 포지션 할당
          </Button>
        )}
        <Slider defaultValue={30} value={volume} onChange={changeVolume} />
      </div>
      <PositionModal open={positionModalOpen} onOk={handleOk} onCancel={closePositionModal} />
    </div>
  );
}
