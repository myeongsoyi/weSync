import TeamMembers from "@/components/team/information/members";
import TeamNotices from "@/components/team/information/notice";

interface IParams {
  params: { teamId: string };
}

export async function generateMetadata({ params: { teamId } }: IParams) {
  // 나중에 api 나오면 대충 이런 식으로...
  // const teamName = await getTeamName(teamId);
  return {
    title: `INFORMATION | ${teamId}` ,
    description: '팀 상세 페이지',
  };
}

export default function TeamInformationPage({ params: { teamId } }: IParams) {
  return (
    <div className="flex flex-row">
      <TeamMembers teamId={teamId}/>
      <TeamNotices teamId={teamId}/>
    </div>
    
  );
}
