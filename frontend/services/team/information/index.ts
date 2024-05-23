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
  const query = `teamId=${teamId}`;
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
  const data = {
    teamId,
    positionName,
    colorId,
  };

  const response = await APIModule({
    action: '/team/position',
    method: 'POST',
    data: data,
  });

  return response;
}

export async function deleteTeamPosition(positionId: number) {
  const data = { positionId };
  const response = await APIModule({
    action: `/team/position`,
    method: 'DELETE',
    data: data,
  });

  return response;
}

export async function putTeamPosition(
  positionId: number,
  positionName: string,
  colorId: number,
) {
  const data = {
    positionId,
    positionName,
    colorId,
  };
  const response = await APIModule({
    action: '/team/position',
    method: 'PUT',
    data: data,
  });

  return response;
}

export async function putMemberPosition(
  teamUserId: number,
  positionId: number,
) {
  const data = {
    teamUserId,
    positionId,
  };

  const response = await APIModule({
    action: '/team/team-position',
    method: 'PUT',
    data: data,
  });

  return response;
}
