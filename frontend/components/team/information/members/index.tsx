import styles from './index.module.scss';
// import { getMainTeams } from '@/services/home';
import MemberList from './memberList'

interface IParams {
    teamId : string
}

export default async function TeamMembers({teamId} :IParams) {
    console.log(teamId);
    // const teams = await getMainTeams();
    const members = [
      {
        id: 1,
        name: '멤버1',
        profileImg: 'svgs/profile-temp.svg',
        isLeader: true,
      },
      {
        id: 2,
        name: '멤버2',
        profileImg: 'svgs/profile-temp.svg',
        isLeader: false,
      },
      {
        id: 3,
        name: '멤버3',
        profileImg: 'svgs/profile-temp.svg',
        isLeader: false,
      },
      {
        id: 4,
        name: '멤버4',
        profileImg: 'svgs/profile-temp.svg',
        isLeader: false,
      },
      {
        id: 5,
        name: '멤버5',
        profileImg: 'svgs/profile-temp.svg',
        isLeader: false,
      },
      {
        id: 6,
        name: '멤버6',
        profileImg: 'svgs/profile-temp.svg',
        isLeader: false,
      },
      {
        id: 7,
        name: '멤버7',
        profileImg: 'svgs/profile-temp.svg',
        isLeader: false,
      },
      {
        id: 8,
        name: '멤버8',
        profileImg: 'svgs/profile-temp.svg',
        isLeader: false,
      },
      {
        id: 9,
        name: '멤버9',
        profileImg: 'svgs/profile-temp.svg',
        isLeader: false,
      },
    ];

  return (
    <div className={styles.memberbox}>
      <h3 className="text-center text-2xl font-bold py-1">MEMBERS</h3>
      <MemberList members = {members}/>
    </div>
  );
}
