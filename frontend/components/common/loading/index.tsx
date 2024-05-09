import Image from 'next/image';

export default function LoadingComponent() {
  return (
    <div className='loading'>
      <div className='flex flex-col justify-center text-center'>
      <Image
        src={'/loading.gif'}
        alt="로딩"
        width={450}
        height={450}
        style={{ margin: 'auto' }}
      ></Image>
      <h2 className="text-center">조금만</h2>
      <h2 className="text-center">기다려주세요</h2>
      </div>
    </div>
  );
}
