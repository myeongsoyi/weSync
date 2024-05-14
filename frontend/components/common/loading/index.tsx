import Image from 'next/image';

export default function Loading() {
  return (
    <div className="loading flex-col justify-center items-center">
      <div>
        <Image
          src={'/loading.gif'}
          alt="로딩"
          width={450}
          height={450}
          style={{ margin: 'auto' }}
        ></Image>
        <h2 className="text-center mt-10">싱크 맞추는 중</h2>
      </div>
    </div>
  );
}
