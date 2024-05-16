'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { deleteUser } from '@/services/logout';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<number | undefined>(undefined);
  const router = useRouter();
  const clickThreshold = 7;
  const clickTimeout = 800; // 클릭 간격 (밀리초)

  useEffect(() => {
    return () => {
      if (clickTimer) {
        clearTimeout(clickTimer); // 컴포넌트 언마운트 시 타이머 정리
      }
    };
  }, []);

  const handleIconClick = async () => {
    clearTimeout(clickTimer);  // 기존 타이머를 클리어합니다.
    setClickTimer(window.setTimeout(() => {
      setClickCount(0); // 클릭 카운트 리셋
    }, clickTimeout));
    
    console.log('Icon clicked', clickCount + 1, 'times.');
    setClickCount((prevCount) => {
      const updatedCount = prevCount + 1;
      return updatedCount;
    });

    if (clickCount + 1 === clickThreshold) {
      deleteUserRequest(); // deleteUser 요청 처리
    }
  };
  
  const deleteUserRequest = async () => {
    if (clickCount + 1 === clickThreshold && window.confirm('정말로 회원 탈퇴를 진행하시겠습니까?')) {
      deleteUser()
        .then(() => {
          router.push('/welcome');
          console.log('User deleted successfully.');
        })
        .catch((error) => {
          console.error('Failed to delete user:', error);
        });
    }
  };

  return (
    <footer className={`${styles.footer} footer`}>
      <div className={`${styles.flex1} ${styles.justifyStart}`}>
        <div className={`bg-white p-2 rounded-xl ${styles.logo}`}>
          <Image
            src={'https://we-sync.s3.ap-southeast-2.amazonaws.com/front/%EC%9B%90%ED%95%A0%EB%AA%A8%EB%8B%88.png'}
            alt="로고"
            width={60}
            height={60}
            className="m-auto h-auto"
            onClick={() => alert('SSAFY 자율 프로젝트 A310')}
            style={{ cursor: 'pointer', borderRadius: '50%' }}
            priority
            unoptimized
          />
        </div>
      </div>
      <div className={`${styles.flex1} ${styles.justifyCenter}`}>
        <p className={`m-auto w-fit ${styles.center}`}>
          weSync {new Date().getFullYear()} Created by ©OneHarMony
        </p>
      </div>
      <div className={`${styles.flex1} ${styles.justifyEnd}`}>
        <div className={styles.icon} onClick={handleIconClick}>
          <Image
            src={'/svgs/wesync_icon.svg'}
            alt="아이콘"
            height={60}
            width={60}
            className="p-1.5 rounded-full border-1 border-white m-auto"
          />
        </div>
      </div>
    </footer>
  );
}
