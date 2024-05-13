import styles from './index.module.scss';
import { getMainTeams } from '@/services/home';
import MemberList from './memberList'

interface IParams {
    teamId : string
}

export default async function TeamMembers({teamId} :IParams) {

    const teams = await getMainTeams();
    const team = teams.filter((team: any) => team.id.toString() === teamId);
    const members = team[0].members;

  return (
    <div className={styles.memberbox}>
      <h3 className="text-center text-2xl font-bold py-1">MEMBERS</h3>
      <MemberList members = {members}/>
    </div>
  );
}
