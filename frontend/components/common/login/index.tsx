'use client';

import React, { useState, useEffect } from 'react';
import KakaoLoginBtn from './kakaoLoginBtn';
import { isLogin } from '@/utils/getAccessToken';
import LoginData from './loginData';
import styles from './index.module.scss';

export default function LoginComponent() {
  const [canLogin, setCanLogin] = useState(true);  // 초기 상태를 true로 설정할 수도 있고, 로딩 상태 표시를 위해 null로 설정할 수도 있습니다.

  useEffect(() => {
    // 컴포넌트가 마운트 되었을 때 로그인 상태를 확인
    const checkLogin = async () => {
      const loggedIn = await isLogin();  // 로그인 상태 확인
      setCanLogin(!loggedIn);  // 로그인 되어 있지 않다면 true, 그렇지 않다면 false
    };

    checkLogin();  // 로그인 상태 체크 함수 실행
  }, []);  // 의존성 배열을 빈 배열로 설정하여 컴포넌트가 처음 마운트될 때만 실행되도록 함

  return (
    <div className={styles.login_container}>
      {canLogin ? <KakaoLoginBtn /> : <LoginData canLogin={canLogin} />}
      {/* <div>{canLogin ? 'Login possible' : 'Already logged in'}</div> */}
    </div>
  );
}
