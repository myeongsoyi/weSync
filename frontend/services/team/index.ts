import APIModule from '@/utils/apiModule';

export async function getPositionColors() {
  const response = await APIModule({
    action: `/team/color`,
    method: 'GET',
    data: null,
  });

  return response;
}

import { getAccessToken } from '@/utils/getAccessToken';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const postCreateTeam = async (formData: FormData) => {
  const accessToken = await getAccessToken();
  const response = await fetch(`${baseURL}/team`, {
    method: 'POST',
    headers: {
      // "Content-Type": "multipart/form-data",
      Authorization: accessToken ?? '',
    },
    body: formData,
  });

  // json 파싱 분기 처리
  try {
    const json = await response.json();
    return json;
  } catch (error) {
    return response;
  }
};

export async function getTeamInviteLink(teamId: string) {
  const response = await APIModule({
    action: `/team/${teamId}`,
    method: 'GET',
    data: null,
  });

  return response;
}

export async function getTeamInviteAccept(code: string) {
  const response = await APIModule({
    action: `/team/invite/${code}`,
    method: 'GET',
    data: null,
  });

  return response;
}

export async function getTeamDetail(teamId: string) {
  const query = `teamId=${teamId}`;
  const response = await APIModule({
    action: `/team/info?${query}`,
    method: 'GET',
    data: null,
  });

  return response;
}

export async function deleteRemoveTeam(teamId: string) {
  const response = await APIModule({
    action: `/team/remove/${teamId}`,
    method: 'DELETE',
    data: null,
  });

  return response;
}

export async function deleteLeaveTeam(teamId: string) {
  const response = await APIModule({
    action: `/team/leave/${teamId}`,
    method: 'DELETE',
    data: null,
  });

  return response;
}

export async function patchTeamInfo(
  teamId: string,
  teamName: string,
  songName: string,
  isFinished: boolean,
  teamProfile?: File,
) {
  const formData = new FormData();
  formData.append('teamName', teamName);
  formData.append('songName', songName);
  formData.append('isFinished', isFinished.toString());
  if (teamProfile) {
    formData.append('teamProfile', teamProfile);
  }

  const accessToken = await getAccessToken();
  const response = await fetch(`${baseURL}/team/${teamId}`, {
    method: 'PATCH',
    headers: {
      // "content-type": "multipart/form-data",
      Authorization: accessToken ?? '',
    },
    body: formData,
  });
  // json 파싱 분기 처리
  try {
    const json = await response.json();
    return json;
  } catch (error) {
    return response;
  }
}