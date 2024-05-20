import CardTeams from './cardTeam';
import styles from './index.module.scss';
import Link from 'next/link';
import Image from 'next/image';

export default async function MainTeams() {
  return (
    <div className={styles.outer}>
      <div className="flex gap-1 my-1">
        <Link className={styles.teamsLink} href="/my-teams">
          <h1 className="font-extrabold pl-3">TEAMS</h1>
          <div className={styles.plusIconWrapper}>
            <Image
              src="/svgs/plus.svg"
              alt="Plus Icon"
              width={20} // 크기 조정
              height={20} // 크기 조정
              className={styles.plusIcon} // 스타일 클래스 추가
            />
          </div>
        </Link>
      </div>
      <h2 className="pl-3 text-orange-400">ON GOING</h2>
      <CardTeams />
    </div>
  );
}
