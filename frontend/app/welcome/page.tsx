import Link from 'next/link';
import Image from 'next/image';
import styles from './index.module.scss';

export default function welcome() {
  return (
    <div>
      <div className="content">
        <div
          style={{
            minHeight: 300,
            // height: "85vh",
            padding: 12,
          }}
        >
          <div className="grid place-items-center">
            <Image
              className={styles.logo}
              src={'/svgs/logo.svg'}
              alt="로고"
              width={100}
              height={100}
            />
            {/* <div className="flex-row my-20">
              <p className='flex'>
              <span className="m-auto text-3xl">Human Voice Is The Best Instrument</span>
              </p>
              <h3>You can Play Score, Record Voice and Combine Files at weSync</h3>
              <h3>Syncronize voices and make wonderful a capella music!</h3>
              <p className="flex">
                <span className="m-auto">목소리는 신이 주신 최고의 악기</span>
              </p>
            </div> */}
            <Link href={'/'}>
              <Image
                className={styles.kakao}
                src={'/svgs/kakao.png'}
                alt="로고"
                width={200}
                height={100}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
