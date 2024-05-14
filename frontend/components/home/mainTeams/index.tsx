import CardTeams from './cardTeam';
import styles from './index.module.scss';
import Link from 'next/link';
import { PlusOutlined } from '@ant-design/icons';

export default async function MainTeams() {
  return (
    <div className={styles.outer}>
      <div className="flex gap-1 my-1">
        <Link className={styles.teamsLink} href="/my-teams">
          <h1 className="font-extrabold pl-3">TEAMS</h1>
          <PlusOutlined
            className={styles.plusIcon}
            style={{ fontSize: '25px', fontWeight: 'bold', marginLeft: '6px' }}
          />
        </Link>
      </div>
      <h2 className="pl-3 text-orange-400">ON GOING</h2>
      <CardTeams />
    </div>
  );
}
