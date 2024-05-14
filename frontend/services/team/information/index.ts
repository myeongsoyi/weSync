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
  const response = await APIModule({
    action: '/team/position',
    method: 'POST',
    data: { teamId, positionName, colorId },
  });

  return response;
}
