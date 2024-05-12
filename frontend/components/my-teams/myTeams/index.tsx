import CardTeams from './cardTeam';
import styles from './index.module.scss';
import Link from 'next/link';


export default async function MainTeams() {

  return (
    <div className={styles.outer}>
      <div className="flex gap-1 my-4">
        <Link href="/my-teams">
          <h2 className="font-extrabold">ALL TEAMS</h2>
        </Link>
      </div>
      <CardTeams />
    </div>
  );
}
