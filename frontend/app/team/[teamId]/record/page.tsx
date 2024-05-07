import RecordPositions from "@/components/team/record/positions";
import RecordScore from "@/components/team/record/score";


interface IParams {
  params: { teamId: string };
}

export async function generateMetadata({ params: { teamId } }: IParams) {
  // 나중에 api 나오면 대충 이런 식으로...
  // const teamName = await getTeamName(teamId);
  return {
    title: `RECORD | ${teamId}` ,
    description: '팀 상세 페이지',
  };
}

export default function TeamRecordPage({ params: { teamId } }: IParams) {
  return (
    <div className="flex flex-row">
      <RecordPositions teamId={teamId} />
      <RecordScore teamId={teamId}/>
    </div>
  );
}
