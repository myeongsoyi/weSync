'use client';

import { Avatar } from 'antd';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

import LocalStorage from '@/utils/localStorage';
import { getLogout } from '@/services/logout';
import styles from './index.module.scss';

interface LoginDataProps {
  canLogin: boolean;
}

export default function LoginData({ canLogin }: LoginDataProps) {
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    if (canLogin) {
      return;
    }
    const profileImg = LocalStorage.getItem('profileImg');
    const nickname = LocalStorage.getItem('nickname');
    setProfileImg(profileImg);
    setNickname(nickname);
  }, [canLogin]);

  const handleLogout = () => {
    Swal.fire({
      title: '로그아웃',
      text: '정말로 로그아웃 하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '예',
      cancelButtonText: '아니오',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // const logOut = await getLogout();
          await getLogout();
          localStorage.clear();
          Swal.fire({
            title: '로그아웃 되었습니다.',
            confirmButtonText: '확인',
            willClose: () => {
              window.location.href = '/welcome';
            },
          });
        } catch (err) {
          Swal.fire('로그아웃에 실패했습니다.');
        }
      }
    });
  };

  return (
    <div className="flex flex-row items-center">
      <div className="mr-1">
        <Avatar
          src={<img src={profileImg as string} alt="avatar" />}
          style={{ width: 50, height: 50, marginRight: 4 }}
        />
      </div>
      <div className="flex flex-col items-center">
        <p className="text-center text-lg text-gray-700 font-bold mt-2">
          {nickname} <span className="text-base text-black font-bold">님</span>
        </p>
        <div onClick={handleLogout} className={styles.logoutButton}>
          <p className={`${styles.logoutText} text-base text-center font-bold`}>
            로그아웃
          </p>
        </div>
      </div>
    </div>
  );
}
