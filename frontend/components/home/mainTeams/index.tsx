import { getMainTeams } from '@/services/home';
import CardTeams from './cardTeam';
import styles from './index.module.scss';
import Link from 'next/link';
import { PlusOutlined } from '@ant-design/icons';


export default async function MainTeams() {
  const teams = await getMainTeams();
  // const myTeam = teams.filter((team) => team.id === 1);
  // console.log(myTeam);
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
        <Link className='flex' href="/my-teams">
          <h2 className="font-extrabold">TEAMS</h2>
        <PlusOutlined style={{ fontSize: '20px', fontWeight: 500 }} />
        </Link>
      </div>
      <h3>Ongoing</h3>
      <CardTeams teams={teams} />
    </div>
  );
}
