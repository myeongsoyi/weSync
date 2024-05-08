import Image from 'next/image';

export default function Loading() {
  return (
    <div className="py-20">
      <Image
        src={'/loading.gif'}
        alt="로딩"
        width={400}
        height={400}
        style={{ margin: 'auto' }}
      ></Image>
    </div>
  );
}
