import styles from './index.module.scss';
import { getTeamRecordPositions, IRecord } from '@/services/team/record';
import PositionBox from './positionBox';
import PositionAdd from './positionAdd';

interface IParams {
  teamId: string;
}

export default async function RecordPositions({ teamId }: IParams) {
  const positions = await getTeamRecordPositions();

  return (
    <div className={styles.section}>
      {positions.map((position: IRecord) => (
        <PositionBox key={position.id} position={position} teamId={teamId} />
      ))}
      <PositionAdd />
    </div>
  );
}
