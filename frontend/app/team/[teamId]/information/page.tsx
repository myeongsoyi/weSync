
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

export default function TeamPage({ params: { teamId } }: IParams) {
  return (
    <>
      <h1>팀 ID : {teamId}</h1>
    </>
  );
}
