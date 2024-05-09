import Link from 'next/link';
import Image from 'next/image';
import styles from './index.module.scss';
import { Carousel } from 'antd';
import React from 'react';

const contentStyle: React.CSSProperties = {
  height: '400px',
  color: '#fff',
  lineHeight: '900px',
  textAlign: 'center',
  background: '#364d79',
};

export default function welcome() {
  return (
    <div>
      <div className="content">
        <div
          style={{
            padding: 12,
          }}
        >
          <div>
            <div className="flex justify-center">
              <Image
                className={styles.logo}
                src={'/svgs/logo.svg'}
                alt="로고"
                width={100}
                height={100}
              />
            </div>
            <div className="flex justify-center">
              <Link href={'/'}>
                <Image
                  className={styles.kakao}
                  src={'/svgs/kakao.png'}
                  alt="카톡로그인"
                  width={150}
                  height={100}
                />
              </Link>
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
