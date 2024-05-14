import APIModule from '@/utils/apiModule';

export async function getTeamMembers(teamId: string) {
  const response = await APIModule({
    action: `/team/members/${teamId}`,
    method: 'GET',
    data: null,
  });

  return response;
}
export async function deleteTeamMember(teamUserId: number) {
  const response = await APIModule({
    action: `/team/${teamUserId}`,
    method: 'DELETE',
    data: null,
  });

  return response;
}

export async function getPositionColors() {
  const response = await APIModule({
    action: '/team/color',
    method: 'GET',
    data: null,
  });

  return response;
}

export async function getTeamPosition(teamId: string) {
  const query = `id=${teamId}`;
  const response = await APIModule({
    action: `/team/position?${query}`,
    method: 'GET',
    data: null,
  });

  return response;
}

export async function postTeamPosition(
  teamId: string,
  positionName: string,
  colorId: number,
) {
  const data = new URLSearchParams({
    teamId, positionName, colorId: colorId.toString(),
  });
  // data를 먼저 확인해보자
  console.log('data:', data);
  

  const response = await APIModule({
    action: '/team/position',
    method: 'POST',
    data: data,
  });

  return response;
}
