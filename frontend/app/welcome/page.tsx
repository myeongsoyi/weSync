import Image from 'next/image';
import styles from './index.module.scss';
import { Carousel } from 'antd';
import React from 'react';
import LoginComponent from '@/components/common/login';
import Link from 'next/link';

const contentStyle: React.CSSProperties = {
  height: '400px',
  color: '#fff',
  lineHeight: '900px',
  textAlign: 'center',
  background: '#364d79',
};

export default async function welcome() {
  return (
    <div>
      <div className="welcome">
        <div
          style={{
            padding: 12,
          }}
        >
          <div>
            <div className="flex justify-center">
              <Link href="/" className={styles.logo}>
                <Image
                  src={'/svgs/logo.svg'}
                  alt="로고"
                  width={1000}
                  height={1000}
                />
              </Link>
            </div>
            <div className={styles.kakao}>
              <LoginComponent />
            </div>
            <div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
