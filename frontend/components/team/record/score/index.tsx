import styles from './index.module.scss';

interface IParams {
    teamId : string
}

export default function RecordScore({teamId} :IParams) {
    return (
        <div className={styles.section}>
        Score Image
      </div>
    );
  }