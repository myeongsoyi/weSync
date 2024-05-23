'use client';

import Image from 'next/image';
import styles from './index.module.scss';
import { useEffect, useState } from 'react';
import {
  postUploadScore,
  getScoreData,
  deleteScore,
} from '@/services/team/record';
import Swal from 'sweetalert2';
import { ScoreResponse } from '@/types/record';
import { FloatButton, Tooltip, message } from 'antd';
import {
  CloudUploadOutlined,
  DeleteOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useRecordAudioStore } from '@/store/recordAudioStore';

interface IParams {
  teamId: string;
}

export default function RecordScore({ teamId }: IParams) {
  const [success, setSuccess] = useState<ScoreResponse['success']>(false);
  const [score, setScore] = useState<ScoreResponse['data']>([]);
  const [error, setError] = useState<ScoreResponse['error']>(null);
  const [scoreUrl, setScoreUrl] = useState<string>('');

  const { scoreIndex } = useRecordAudioStore((state) => ({
    scoreIndex: state.scoreIndex,
    setScoreIndex: state.setScoreIndex,
  }));

  useEffect(() => {
    const fetchScore = async () => {
      const response = await getScoreData(teamId);
      if (response.success) {
        setSuccess(response.success);
        setScore(response.data);
        setError(response.error);
      } else {
        setSuccess(response.success);
        setError(response.error);
      }
    };
    fetchScore();
  }, [teamId]);

  useEffect(() => {
    if (score !== undefined && score.length > 0) {
      if (score[scoreIndex]?.score_url) {
        setScoreUrl(score[scoreIndex].score_url);
      } else {
        message.warning('악보가 없습니다.');
        if (!scoreUrl) {
          setScoreUrl('/svgs/score.svg');
        }
      }
    } else {
      setScoreUrl('/svgs/score.svg');
    }
  }, [scoreIndex, score]);

  const handleUpload = async () => {
    Swal.fire({
      title: '악보를 업로드 해주세요',
      input: 'file',
      inputAttributes: {
        accept: 'application/pdf',
        'aria-label': '악보 업로드',
      },
      showCancelButton: true,
      confirmButtonText: '업로드',
      cancelButtonText: '취소',
      preConfirm: (file) => {
        if (!file) {
          Swal.showValidationMessage('파일을 선택해 주세요');
          return false;
        } else {
          return file;
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        const file = result.value;

        const formData = new FormData();
        formData.append('file', file);

        const response = await postUploadScore(teamId, formData);
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: '악보 업로드 성공',
            text: '작업이 완료될 때까지 잠시만 기다려주세요.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: '악보 업로드 실패',
            text: response.error?.errorMessage,
          });
        }
      }
    });
  };

  async function handleDelete(teamId: string) {
    const response = await deleteScore(teamId);
    if (response.success) {
      Swal.fire({
        icon: 'success',
        title: '악보 삭제 성공',
        text: '작업이 완료될 때까지 잠시만 기다려주세요.',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: '악보 삭제 실패',
        text: response.error?.errorMessage,
      });
    }
  }

  if (!success) {
    return (
      <div>
        <p>{error?.errorMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <FloatButton.Group
        trigger="click"
        type="primary"
        style={{ right: 32, bottom: '15vh', zIndex: 3000 }}
        icon={<MenuOutlined />}
      >
        {score.length > 0 && (
          <Tooltip title="악보 삭제">
        <FloatButton
          icon={
            <DeleteOutlined
              style={{ color: 'red' }}
              onClick={() => handleDelete(teamId)}
            />
          }
        />
      </Tooltip>
        )}
        <Tooltip title="악보 업로드">
        <FloatButton icon={<CloudUploadOutlined />} onClick={handleUpload} />
      </Tooltip>
      </FloatButton.Group>
      {score.length === 0 ? (
        <h2>우측 하단 버튼을 클릭하고 악보를 업로드 해주세요.</h2>
      ) : (
        <>
          <Image
            src={scoreUrl}
            alt="악보"
            width={1000}
            height={1000}
            style={{ width: '100%' }}
            unoptimized
          />
        </>
      )}
    </div>
  );
}
