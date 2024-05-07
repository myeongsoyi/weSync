import styles from './index.module.scss';

interface IParams {
    teamId : string
}

export default function RecordScore({teamId} :IParams) {
  console.log('teamId:', teamId);
  
    return (
        <div className={styles.section}>
        Score Image
      </div>
    );
  }