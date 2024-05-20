import APIModule from '@/utils/apiModule';
import LocalStorage from '@/utils/localStorage';

export async function getTeamNotices(teamId: string) {
  const response = await APIModule({
    action: `/notices/${teamId}`,
    method: 'GET',
    data: null,
  });

  return response;
}

export async function postTeamNotice(
  teamId: string,
  content: string,
  isFixed: boolean = false,
) {
  const data = {
    content,
    isFixed,
  };
  const teamUserId = LocalStorage.getItem('memberId');
  const response = await APIModule({
    action: `/notices/${teamId}/${teamUserId}`,
    method: 'POST',
    data: data,
  });

  return response;
}

export async function putTeamNotice(
    noticeId: number,
    content: string,
) {
    const data = {
        content,
    };
    const teamUserId = LocalStorage.getItem('memberId');
    const response = await APIModule({
        action: `/notices/content/${noticeId}/${teamUserId}`,
        method: 'PUT',
        data: data,
    });

    return response;
}

export async function putChangeFixed(noticeId: number) {
    const teamUserId = LocalStorage.getItem('memberId');
  const response = await APIModule({
    action: `/notices/fix/${noticeId}/${teamUserId}`,
    method: 'PUT',
    data: null,
  });

  return response;
}

export async function deleteNotice(noticeId: number) {
    const teamUserId = LocalStorage.getItem('memberId');
  const response = await APIModule({
    action: `/notices/${noticeId}/${teamUserId}`,
    method: 'DELETE',
    data: null,
  });

  return response;
}