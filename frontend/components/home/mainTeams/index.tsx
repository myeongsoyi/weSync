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
      <div className="flex gap-1 my-1">
        <Link className='flex' href="/my-teams">
          <h1 className="font-extrabold pl-3 ">TEAMS</h1>
        <PlusOutlined style={{ fontSize: '20px', fontWeight: 500, paddingLeft: '6px'}} />
        </Link>
      </div>
      <h2 className='pl-3 text-orange-400'>ONGOING</h2>
      <CardTeams teams={teams} />
    </div>
  );
}
