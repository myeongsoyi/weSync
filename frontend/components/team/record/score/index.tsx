import styles from './index.module.scss';

interface IParams {
    teamId : string
}

export default function RecordScore({teamId} :IParams) {
  
    return (
      <div className={styles.section}>
        <p className='hidden'>{teamId}</p>
      </div>
    );
  }