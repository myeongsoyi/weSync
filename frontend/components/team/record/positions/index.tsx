import styles from './index.module.scss';
import PositionBox from './positionBox';

interface IParams {
  teamId: string;
}

export default async function RecordPositions({ teamId }: IParams) {

  return (
    <div className={styles.section}>
        <PositionBox teamId={teamId} />
    </div>
  );
}
