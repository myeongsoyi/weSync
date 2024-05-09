import styles from './index.module.scss';
import { getTeamNotices } from '@/services/team';
import NoticeList from './noticeList';
import { Pagination, Tooltip } from 'antd';
import NoticeWrite from './noticeWrite/noticeWrite'; 

interface IParams {
  teamId: string;
}


export default async function TeamNotices({teamId} :IParams) {

    const notices = await getTeamNotices(teamId);


  return (
    <div className={styles.noticebox}>
      <div className="text-center bg-yellow-400 py-2 ">
        <span className="text-3xl font-bold">NOTICE</span>
      </div>
      <NoticeList notices={notices} />
      <div className="flex justify-between items-center px-2">
        <div style={{ width: 48, marginLeft: '0.75rem' }} />
        <Pagination
          defaultCurrent={1}
          total={50}
          pageSize={5}
          style={{ flex: 1, textAlign: 'center' }}
        />
        <Tooltip placement="top" title={'글 작성하기'} arrow={true}>
          <NoticeWrite/>
        </Tooltip>
      </div>
    </div>
  );
}
