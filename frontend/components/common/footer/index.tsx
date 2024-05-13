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
    <footer className="flex justify-center items-center py-auto px-6 bg-sky-700 text-white overflow-x-hidden">
      <div className="flex-1 flex justify-center">
        <div className={`bg-white p-2 rounded-xl ${styles.logo}`}>
          <Image
            src={'/svgs/logo.svg'}
            alt="로고"
            width={150}
            height={100}
            className="m-auto h-auto"
            onClick={() => alert('자율 프로젝트 A310')}
            style={{ cursor: 'pointer' }}
            priority
          />
        </div>
      </div>
      <div className="flex-1 flex">
        <p className={`m-auto w-fit ${styles.center}`}>
          weSync ©{new Date().getFullYear()} Created by A310
        </p>
      </div>
      <div className="flex-1 flex justify-center">
        <div className={styles.icon} onClick={handleIconClick}>
          <Image
            src={'/svgs/wesync_icon.svg'}
            alt="아이콘"
            height={67}
            width={67}
            className="p-1.5 rounded-full border-1 border-white m-auto"
          />
        </div>
      </div>
    </footer>
  );
}
