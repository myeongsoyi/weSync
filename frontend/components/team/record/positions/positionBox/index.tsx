'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './index.module.scss';
import { EditOutlined } from '@ant-design/icons';
import { Button, Slider, Tag } from 'antd';
import { IRecord } from '@/services/team/record';

interface IParams {
  teamId: string;
  position: IRecord;
}

export default function PositionBox({ teamId, position }: IParams) {
  const [isMute, setIsMute] = useState(false);
  const [volume, setVolume] = useState(30);
  const [savedVolume, setSavedVolume] = useState(30);

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
      <p className="hidden">{teamId}</p>
      <Button
        onClick={clickMute}
        type="text"
        style={{
          padding: '1px',
          width: '20%',
          margin: 'auto',
          height: 'auto',
        }}
      >
        {!isMute ? (
          <Image
            src={'/images/volume_on.png'}
            alt="볼륨온"
            width={50}
            height={50}
          />
        ) : (
          <Image
            src={'/images/volume_mute.png'}
            alt="볼륨오프"
            width={50}
            height={50}
          />
        )}
      </Button>
      <div className={styles.box_slider}>
        {position.name ? (
          <Tag
            style={{
              color: `${position.color}`,
              borderColor: `${position.color}`,
              fontSize: 15,
              width: '100%',
              padding: 4,
              textAlign: 'center',
              marginTop: 10,
            }}
          >
            {position.name}
          </Tag>
        ) : (
          <p className="text-center">
            <EditOutlined /> 포지션 할당
          </p>
        )}
        <Slider
          defaultValue={30}
          value={volume}
          onChange={changeVolume}
        ></Slider>
      </div>
    </div>
  );
}
