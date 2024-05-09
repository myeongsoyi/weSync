import Image from 'next/image';
import styles from './index.module.scss';

interface IParams {
    teamId : string
}

export default function RecordScore({teamId} :IParams) {
  
    return (
      <div className={styles.section}>
        <p className='hidden'>{teamId}</p>
        <Image className='p-20 m-auto' src={'/images/score.png'} alt="record_score" width={600} height={600} />
      </div>
    );
  }