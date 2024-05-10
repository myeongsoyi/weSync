'use client';

import { Avatar, Button, message } from 'antd';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

import LocalStorage from '@/utils/localStorage';
import { getLogout } from '@/services/logout';

export default function loginData(props: { canLogin: boolean }) {
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);

  const { canLogin } = props;

  useEffect(() => {
    if (canLogin) {
      return;
    }
    const profileImg = LocalStorage.getItem('profileImg');
    const nickname = LocalStorage.getItem('nickname');
    setProfileImg(profileImg);
    setNickname(nickname);
  }, []);

  const clickLogOut = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      // const logOut = await getLogout();
      // console.log(logOut);
      // if (logOut.success) {
      //   console.log("로그아웃 성공");
      //   window.location.href = "/welcome";
      // } else {
      //   console.error("로그아웃 실패");
      // }
      try {
        const logOut = await getLogout();
        console.log(logOut);
        if (logOut.success) {
          localStorage.clear();
          console.log('로그아웃 성공');
          window.location.href = '/welcome';
        } else {
          console.error('로그아웃 실패');
        }
      } catch (err) {
        console.error('로그아웃 실패');
      }
    } else {
      console.log('로그아웃 취소');
    }
  };

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
        // 확인 버튼을 눌렀을 때 실행될 로직
        try {
          const logOut = await getLogout();
          // console.log(logOut);
          if (logOut.success) {
            message.success('로그아웃 되었습니다.');
            localStorage.clear();
          } else {
            message.success('로그아웃에 실패했습니다.');
            console.error('로그아웃 실패');
          }
        } catch (err) {
          message.success('로그아웃에 실패했습니다.');
          console.error('로그아웃 실패', err);
        }
        // 로그아웃 후 이동
        window.location.href = '/welcome';
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
          {nickname} <span className='text-base text-black font-bold'>님</span>
        </p>
        <Button type="text" size="small" onClick={handleLogout}>
          <p className="text-base text-center text-amber-500 font-bold">
            로그아웃
          </p>
        </Button>
      </div>
    </div>
  );
}
