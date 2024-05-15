import Image from 'next/image';
import styles from './index.module.scss';
import { Carousel } from 'antd';
import React from 'react';
import LoginComponent from '@/components/common/login';
import Link from 'next/link';

const contentStyle: React.CSSProperties = {
  height: '400px',
  color: '#fff',
  lineHeight: '400px',
  textAlign: 'center',
  background: '#364d79',
};

export default function welcome() {
  return (
    <div>
      <div className={`${styles.welcome} welcome`}>
        <div className={styles.content}>
          <div>
            <div className="flex justify-center">
              <Link href="/" className={styles.logo}>
                <Image
                  src={'/svgs/logo.svg'}
                  alt="로고"
                  width={1000}
                  height={1000}
                  className='h-auto'
                />
              </Link>
            </div>
            <div className={styles.kakao}>
              <LoginComponent />
            </div>
            <div className={styles.carouselWrapper}>
              <Carousel autoplay autoplaySpeed={3000} speed={500}>
                <div>
                  <h3 style={contentStyle}>1</h3>
                </div>
                <div>
                  <h3 style={contentStyle}>2</h3>
                </div>
                <div>
                  <h3 style={contentStyle}>3</h3>
                </div>
              </Carousel>
              <div className={styles.floatingButton}>
                <Link href="/">
                  <Image
                    src={'/svgs/start.svg'}
                    alt="시작하기"
                    width={200} // 크기 키움
                    height={200} // 크기 키움
                    className={styles.startButton} // 스타일 클래스 추가
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
