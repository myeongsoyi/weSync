import styles from './index.module.scss';
import NoticeList from './noticeList';

interface IParams {
  teamId: string;
}

export default async function TeamNotices({ teamId }: IParams) {

  return (
    <div className={styles.noticebox}>
      <div className="text-center bg-yellow-400 py-2 pb-3 ">
        <span className="text-3xl font-bold">NOTICE</span>
      </div>
      <NoticeList teamId={teamId} />
    </div>
  );
}
