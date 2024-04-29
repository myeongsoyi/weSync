import styles from './index.module.scss';
import { getMainTeams } from '@/services/home';
import MemberList from './memberList'

interface IParams {
    teamId : string
}

export default async function TeamMembers({teamId} :IParams) {

    const teams = await getMainTeams();
    const team = teams.filter((team) => team.id.toString() === teamId);
    const members = team[0].members;
    console.log(team);

  return (
    <div className={styles.memberbox}>
      <h3 className="text-center">Members</h3>
      <MemberList members = {members}/>
    </div>
  );
}
