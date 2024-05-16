'use client';

import Image from 'next/image';
import styles from './index.module.scss';
import { Carousel } from 'antd';
import React from 'react';
import LoginComponent from '@/components/common/login';
import Link from 'next/link';

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
                  className="h-auto"
                />
              </Link>
            </div>
            <div className={styles.kakao}>
              <LoginComponent />
            </div>
            <div className={styles.carouselWrapper}>
              {/* <Carousel autoplay speed={1500} autoplaySpeed={6000} arrows> */}
              {/* arrows 사용시 react-slick 때문에 콘솔에 경고 발생 */}
              <Carousel autoplay speed={1500} autoplaySpeed={6000}>
                <div>
                  <Image
                    src="https://we-sync.s3.ap-southeast-2.amazonaws.com/front/infoIMG1.png"
                    alt="Carousel Image 1"
                    // layout="responsive"
                    width={1000}
                    height={400}                   
                    unoptimized
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <Image
                    src="https://we-sync.s3.ap-southeast-2.amazonaws.com/front/infoIMG2.png"
                    alt="Carousel Image 2"
                    // layout="responsive"
                    width={1000}
                    height={400}
                    // objectFit="cover"
                    unoptimized
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <Image
                    src="https://we-sync.s3.ap-southeast-2.amazonaws.com/front/infoIMG3.png"
                    alt="Carousel Image 3"
                    // layout="responsive"
                    width={1000}
                    height={400}
                    // objectFit="cover"
                    unoptimized
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <Image
                    src="https://we-sync.s3.ap-southeast-2.amazonaws.com/front/infoIMG4.png"
                    alt="Carousel Image 4"
                    // layout="responsive"
                    width={1000}
                    height={400}
                    // objectFit="cover"
                    unoptimized
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </Carousel>
              <div className={styles.floatingButton}>
                <Link href="/">
                  <Image
                    src={'/svgs/start.svg'}
                    alt="시작하기"
                    width={200}
                    height={100}
                    className={styles.startButton}
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
