import styles from './index.module.scss';
import { getTeamNotices } from '@/services/team';
import NoticeList from './noticeList'

interface IParams {
    teamId : string
}

export default async function TeamNotices({teamId} :IParams) {

    const notices = await getTeamNotices(teamId);
    console.log(notices);

  return (
    <div className={styles.noticebox}>
      <div className="text-center bg-yellow-400 py-2"><span className='text-3xl font-bold'>Notice</span></div>
      <NoticeList notices = {notices} />
    </div>
  );
}
