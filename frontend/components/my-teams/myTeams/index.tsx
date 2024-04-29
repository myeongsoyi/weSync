import { getMyTeams } from '@/services/my-teams';
import CardTeams from './cardTeam';
import styles from './index.module.scss';
import Link from 'next/link';


export default async function MainTeams() {
  const teams = await getMyTeams();

  // const teams: {
  //     id: number;
  //     name: string;
  //     song: string;
  //     myPosition: {
  //         position: string;
  //         color: string;
  //     };
  //     teamImg: string;
  //     members: {
  //         id: number;
  //         name: string;
  //         profileImg: string;
  //     }[];
  // }[]

  return (
    <div className={styles.outer}>
      <div className="flex gap-1 my-4">
        <Link href="/my-teams">
          <h2 className="font-extrabold">ALL TEAMS</h2>
        </Link>
      </div>
      <CardTeams teams={teams} />
    </div>
  );
}
