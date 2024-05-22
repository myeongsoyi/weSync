import APIModule from '@/utils/apiModule';
import { getAccessToken } from '@/utils/getAccessToken';

export interface IRecord {
  id: number;
  name: string | null;
  color: string | null;
}
function formatNumber(num: number): string {
  // 숫자를 문자열로 변환
  const numString = num.toString();

  // 소수점 위치 찾기
  const decimalIndex = numString.indexOf('.');

  // 소수점이 있는 경우
  if (decimalIndex !== -1) {
    const integerPart = numString.substring(0, decimalIndex); // 정수 부분
    const decimalPart = numString.substring(decimalIndex + 1); // 소수 부분
    return `${integerPart}:${decimalPart}`;
  } else {
    // 소수점이 없는 경우 ':0' 추가
    return `${numString}:0`;
  }
}

export async function postSaveRecord(
  scoreId: number,
  title: string,
  startAt: number,
  endAt: number,
  file: File,
) {
  const newStartAt = formatNumber(startAt);
  const newEndAt = formatNumber(endAt);

  const data = {
    title,
    startAt: newStartAt,
    endAt: newEndAt,
  };

  const formData = new FormData();
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

  if (file) {
    formData.append('file', file);
  }

  const accessToken = await getAccessToken();
  const response = await fetch(`${baseURL}/records/${scoreId}`, {
    method: 'POST',
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

export async function putChangeRecordPublic(recordId: number) {
  const response = await APIModule({
    action: `/records/${recordId}`,
    method: 'PUT',
    data: null,
  });

  return response;
}

export async function deleteRecord(recordId: number) {
  const response = await APIModule({
    action: `/records/${recordId}`,
    method: 'DELETE',
    data: null,
  });

  return response;
}

export async function postScoreGetPosition(scoreId: number, positionId: number) {
  const data = {
    scoreId,
    positionId,
  }
  const response = await APIModule({
    action: `/team/score-position`,
    method: 'POST',
    data: data,
  });

  return response;
}


// 악보 업로드 파트
export async function postUploadScore(teamId: string, formData: FormData) {
  const accessToken = await getAccessToken();
  const response = await fetch(`https://wesync.co.kr/py-api/score/${teamId}`, {
    method: 'POST',
    headers: {
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

export async function getScoreData(teamId: string) {
  const accessToken = await getAccessToken();
  const response = await fetch(`https://wesync.co.kr/py-api/score/${teamId}`, {
    method: 'GET',
    headers: {
      Authorization: accessToken ?? '',
    },
    body: null,
  });

  // json 파싱 분기 처리
  try {
    const json = await response.json();
    return json;
  } catch (error) {
    return response;
  }
}

export async function deleteScore(teamId:string) {
  const accessToken = await getAccessToken();
  const response = await fetch(`https://wesync.co.kr/py-api/score/${teamId}`, {
    method: 'DELETE',
    headers: {
      Authorization: accessToken ?? '',
    },
    body: null,
  });

  // json 파싱 분기 처리
  try {
    const json = await response.json();
    return json;
  } catch (error) {
    return response;
  }
}

export async function postAddScorePosition(teamId: string, partNum: number) {
  const accessToken = await getAccessToken();
  const response = await fetch(`https://wesync.co.kr/py-api/score/${teamId}/${partNum}`, {
    method: 'POST',
    headers: {
      Authorization: accessToken ?? '',
    },
    body: null,
  });

  // json 파싱 분기 처리
  try {
    const json = await response.json();
    return json;
  } catch (error) {
    return response;
  }
}