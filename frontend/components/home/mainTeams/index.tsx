import CardTeams from './cardTeam';
import styles from './index.module.scss';
import Link from 'next/link';
import { PlusOutlined } from '@ant-design/icons';

export default async function MainTeams() {

  return (
    <div className={styles.outer}>
      <div className="flex gap-1 my-4">
        <Link className='flex' href="/my-teams">
          <h2 className="font-extrabold">TEAMS</h2>
        <PlusOutlined style={{ fontSize: '20px', fontWeight: 500 }} />
        </Link>
      </div>
      <h3>Ongoing</h3>
      <CardTeams />
    </div>
  );
}
