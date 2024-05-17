'use client';

import Image from 'next/image';
import React from 'react';
import styles from './index.module.scss';
import Link from 'next/link';

export default function Footer() {
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
          weSync {new Date().getFullYear()} Created by OneHarMony™
        </p>
        <div className={styles.links}>
          <Link href="/welcome">INFO</Link>
          <span className={styles.separator}>|</span>
          <Link href="/">HOME</Link>
          <span className={styles.separator}>|</span>
          <span style={{ fontSize: '15px', color: 'lightgray' }}>
            SERVICE : 멀티캠퍼스 역삼 (02-3429-5114)
          </span>
        </div>
      </div>
      <div className={`${styles.flex1} ${styles.justifyEnd}`}>
        <div className={styles.icon}>
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
