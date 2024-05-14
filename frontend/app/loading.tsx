import Image from 'next/image';

export default function Loading() {
  return (
    <div className="loading flex-col justify-center items-center">
      <div>
        <Image
          src={'https://we-sync.s3.ap-southeast-2.amazonaws.com/front/Loading.gif'}
          alt="로딩"
          width={450}
          height={450}
          priority
          style={{ margin: 'auto', height: 'auto'}}
        ></Image>
        <h2 className="text-center mt-10">잠시만</h2>
        <h2 className="text-center mb-10">기다려주세요</h2>
      </div>
    </div>
  );
}
