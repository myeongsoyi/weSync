import { getMainTeams } from '@/services/home';
import CardTeams from './cardTeam';
import styles from './index.module.scss';


export default async function MainTeams() {
  const teams = await getMainTeams();

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
      <CardTeams teams={teams} />
    </div>
  );
}
