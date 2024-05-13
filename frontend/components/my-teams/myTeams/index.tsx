import CardTeams from './cardTeam';
import styles from './index.module.scss';
import Link from 'next/link';


export default async function MainTeams() {

  return (
    <div className={styles.outer}>
      <div className="flex gap-1 my-4">
        <Link href="/my-teams">
        <h1 className="font-extrabold pl-3 ">ALL TEAMS</h1>
        </Link>
      </div>
      <CardTeams />
    </div>
  );
}
