'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './index.module.scss';
import { EditOutlined } from '@ant-design/icons';
import { Button, Slider } from 'antd';

// 포지션 타입 정의
interface IPosition {
  id: number;
  isMute: boolean;
  volume: number;
  savedVolume: number;
}

// export default function RecordPositions({ teamId }: IParams) {
export default function PositionAdd() {
  const [count, setCount] = useState<number>(0);
  const [positions, setPositions] = useState<IPosition[]>([]);

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
        pos.id === id ? pos.isMute
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
          } : pos,
      ),
    );
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
            <p className="text-center">
              <EditOutlined /> 포지션 할당
            </p>
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
            ></Slider>
            {/* <span>{position.id} {position.savedVolume} {position.volume} {`${position.isMute}`}</span> */}
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
    </>
  );
}
