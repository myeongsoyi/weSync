import styles from './index.module.scss';
import Table from './table';
// import { getTeamPrivateRecords } from '@/services/team';

export default async function TeamWorkspacePrivate() {
  // const records = await getTeamPrivateRecords();

  return (
    <div className={styles.article}>
      <div className={styles.table}>
        <Table />
      </div>
    </div>
  );
}
