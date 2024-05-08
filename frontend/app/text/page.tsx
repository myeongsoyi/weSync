import Image from 'next/image';

export default function Loading() {
  return (
    <div className='loading'>
      <Image
        src={'/loading.gif'}
        alt="로딩"
        width={450}
        height={450}
        style={{ margin: 'auto' }}
      ></Image>
    </div>
  );
}
