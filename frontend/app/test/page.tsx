'use client'

import Image from 'next/image';
import AlertTest from '@/components/home/alertTest';
import CssTest from '@/components/home/cssTest';

export default function TestComponent() {  
  

  return (
    <div className="loading flex-col justify-center items-center">
      {/* <Button type="primary" onClick={handleClick}>버튼</Button> */}
      <div>
        <Image
          src={'https://we-sync.s3.ap-southeast-2.amazonaws.com/front/Loading.gif'}
          alt="로딩"
          width={450}
          height={450}
          style={{ margin: 'auto' }}
          priority
        ></Image>
        <h2 className="text-center mt-10">잠시만</h2>
        <h2 className="text-center">기다려주세요</h2>
      </div>
      <AlertTest />
      <CssTest />
    </div>
  );
}
