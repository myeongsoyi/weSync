import styles from './index.module.scss';
import { getTeamRecordPositions, IRecord } from '@/services/team/record';
import PositionBox from './positionBox';
import PositionAdd from './positionAdd';

interface IParams {
  teamId: string;
}

export default async function RecordPositions({ teamId }: IParams) {

  return (
    <div className={styles.section}>
        <PositionBox teamId={teamId} />
      <PositionAdd />
    </div>
  );
}
