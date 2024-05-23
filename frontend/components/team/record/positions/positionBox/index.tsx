'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './index.module.scss';
import { CheckCircleOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Slider, Tag } from 'antd';
// import { getScoreData, postAddScorePosition } from '@/services/team/record';
import { getScoreData } from '@/services/team/record';
import { ScoreResponse } from '@/types/record';
import { useRecordAudioStore } from '@/store/recordAudioStore';
import ScorePositionModal from './scorePositionModal';

interface IParams {
  teamId: string;
}

interface IVolume {
  index: number;
  volume: number;
  isMute: boolean;
  isAudio: boolean;
}

export default function scoreBox({ teamId }: IParams) {
  const [modalVisible, setModalVisible] = useState(false);
  const [volume, setVolume] = useState<IVolume[]>([]);
  const [success, setSuccess] = useState<ScoreResponse['success']>(false);
  const [score, setScore] = useState<ScoreResponse['data']>([]);
  const [error, setError] = useState<ScoreResponse['error']>(null);
  const [scorePosition, setScorePosition] = useState<number|null>(null);

  const { scoreIndex, setScoreIndex, setTracks, toggleTrack, setVolumeTrack, setScoreId, isPlaying } = useRecordAudioStore((state) => ({
    setTracks: state.setTracks,
    scoreIndex: state.scoreIndex,
    setScoreIndex: state.setScoreIndex,
    toggleTrack: state.toggleTrack,
    setVolumeTrack: state.setVolume,
    setScoreId: state.setScoreId,
    isPlaying: state.isPlaying,
  }));

  useEffect(() => {
    const fetchScore = async () => {
      const response = await getScoreData(teamId);
      if (response.success) {
        setSuccess(response.success);
        setScore(response.data);
        setError(response.error);
        setVolume(
          response.data.map(
            (res: ScoreResponse['data'][number], index: number) => ({
              index,
              volume: res.accompaniment_url ? 50 : 0,
              isMute: res.accompaniment_url ? false : true,
              isAudio: res.accompaniment_url ? true : false,
            }),
          ),
        );
        if (response.data.length > 0) {
        setScoreId(response.data[0].score_id);
        }
      } else {
        setSuccess(response.success);
        setError(response.error);
      }
    };
    fetchScore();
  }, []);

  useEffect(() => {
    // 나중에 index를 score_id로 변경할 것
    const validScores = score.filter((item) => item.accompaniment_url !== null);

    setTracks(
      validScores.map((item, index) => ({
        id: item.score_id as number,
        url: item.accompaniment_url as string,
        name: item.position_name ?? `미할당 ${index + 1}`,
        playing: false,
        volume: 0.5,
      }))
    );
  }, [score]);

  function changeVolume(index: number, value: number) {
    setVolume((prev) => {
      const newVolume = [...prev];
      newVolume[index].volume = value;
      newVolume[index].isMute = false;
      return newVolume;
    });
    const id = score[index].score_id;
    setVolumeTrack(id, value/100);
  }

  function clickMute(index: number) {
    const isMute = volume[index].isMute;
    setVolume((prev) => {
      const newVolume = [...prev];
      newVolume[index].isMute = !isMute;
      return newVolume;
    });
    const id = score[index].score_id;
    const url = score[index].accompaniment_url;
    const name = score[index].position_name ?? `미할당 ${index + 1}`;
    toggleTrack(id, url, name);
  }

  // const clickAddPosition = async (teamId: string, partNum: number) => {
  //   const response = await postAddScorePosition(teamId, partNum);
  //   if (response.success) {
  //     window.location.reload();
  //   } else {
  //     message.error('포지션 추가에 실패했습니다.');
  //   }
  // };

  const handleModalOk = () => {
    setModalVisible(false);
    window.location.reload();
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleTagClick = (score_id: number) => {
    setScorePosition(score_id);
    setModalVisible(true);
  }

  if (!success) {
    return <p>{error?.errorMessage}</p>;
  } else if (score.length === 0) {
    return <p></p>;
  }

  return (
    <div className={styles.section}>
      {score.map((score, index) => (
        <div className={styles.controller} key={index}>
          <div>
            <Button
              onClick={() => clickMute(index)}
              type="text"
              style={{
                padding: '1px',
                width: '100%',
                margin: 'auto',
                height: 'auto',
                zIndex: 10,
              }}
              disabled={!volume[index].isAudio || isPlaying ? true : false}
            >
              {!volume[index].isMute ? (
                <Image
                  src={'/svgs/volume_on.svg'}
                  alt="볼륨온"
                  width={50}
                  height={50}
                  className="m-auto"
                  unoptimized
                />
              ) : (
                <Image
                  src={'/svgs/volume_mute.svg'}
                  alt="볼륨오프"
                  width={50}
                  height={50}
                  className="m-auto"
                  unoptimized
                />
              )}
            </Button>
            <Button
              onClick={() => [setScoreIndex(index),setScoreId(score.score_id)]}
              type="text"
              style={{
                padding: '1px',
                width: '100%',
                margin: 'auto',
                height: 'auto',
                zIndex: 10,
              }}
            >
              <CheckCircleOutlined
                style={
                  index === scoreIndex
                    ? { color: 'blue', fontSize: 21 }
                    : { color: 'darkgray', fontSize: 14 }
                }
                className="mb-2 mr-1"
              />
            </Button>
          </div>
          <div className={styles.box_slider}>
            {score.position_name ? (
              <Tag
                style={{
                  color: `#${score.color_code}`,
                  borderColor: `#${score.color_code}`,
                  fontSize: 15,
                  width: '100%',
                  padding: 4,
                  textAlign: 'center',
                  marginTop: 10,
                  cursor: 'pointer',
                }}
                onClick={()=>handleTagClick(score.score_id)}
              >
                {score.position_name}
              </Tag>
            ) : (
              <p className="text-center cursor-pointer hover:bg-slate-100" onClick={()=>handleTagClick(score.score_id)}>
                <EditOutlined /> 포지션 할당
              </p>
            )}
            <Slider
              defaultValue={50}
              value={volume[index].isMute ? 0 : volume[index].volume}
              onChange={(value) => changeVolume(index, value)}
              disabled={!volume[index].isAudio || isPlaying ? true : false}
            ></Slider>
          </div>
        </div>
      ))}
      {/* <>
        <div className={styles.add_controller}>
          <Button
            onClick={() => clickAddPosition(teamId, score.length)}
            type="text"
            style={{ height: 'auto', padding: '0.5rem auto' }}
          >
            <h2>포지션 추가</h2>
          </Button>
        </div>
      </> */}
      <ScorePositionModal
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        selectedMemberId={scorePosition}
      />
    </div>
  );
}
