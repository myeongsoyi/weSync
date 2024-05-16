import Tabs from '@/components/team/workspace/tabs';
import styles from './index.module.scss';
interface IParams {
  params: { teamId: string };
}

export async function generateMetadata({ params: { teamId } }: IParams) {
  // 나중에 api 나오면 대충 이런 식으로...
  // const teamName = await getTeamName(teamId);
  return {
    title: `WORKSPACE | ${teamId}` ,
    description: '팀 상세 페이지',
  };
}

// export default function TeamPage({ params: { teamId } }: IParams) {
export default function TeamPage() {
return (
    <div className={styles.tabs}>
      <Tabs />
    </div>
  );
}
