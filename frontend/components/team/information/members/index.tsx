import styles from './index.module.scss';
// import { getMainTeams } from '@/services/home';
import MemberList from './memberList'

interface IParams {
    teamId : string
}

export default function TeamMembers({teamId} :IParams) {

  return (
    <div className={styles.memberbox}>
      <h3 className="text-center text-2xl font-bold py-1">MEMBERS</h3>
      <MemberList teamId={teamId} />
    </div>
  );
}
