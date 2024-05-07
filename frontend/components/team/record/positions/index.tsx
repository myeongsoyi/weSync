'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './index.module.scss';
import { EditOutlined } from '@ant-design/icons';
import { Button, Slider } from 'antd';

interface IParams {
  teamId: string;
}

export default function RecordPositions({ teamId }: IParams) {
  const [isMute, setIsMute] = useState(false);
  const [volume, setVolume] = useState(30);
  const [savedVolume, setSavedVolume] = useState(30);

  function changeVolume(value: number) {
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
    <div className={styles.section}>
      <div className={styles.controller}>
        {!isMute ? (
          <Button onClick={clickMute} type="text" style={{ padding: '1px' }}>
            <Image
              src={'/images/volume_on.png'}
              alt="볼륨온"
              width={25}
              height={25}
            />
          </Button>
        ) : (
          <Button onClick={clickMute} type="text" style={{ padding: '1px' }}>
            <Image
              src={'/images/volume_mute.png'}
              alt="볼륨오프"
              width={25}
              height={25}
            />
          </Button>
        )}
        <div>
          <p>
            <EditOutlined /> 포지션 할당
          </p>
          <Slider defaultValue={30} value={volume} onChange={changeVolume}></Slider>
        </div>
      </div>
      <p>{volume}</p>
    </div>
  );
}
