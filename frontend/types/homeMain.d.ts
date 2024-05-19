export interface MainActiveTeams {
  success: boolean;
  data:
    | {
        teamId: number;
        teamName: string;
        songName: string;
        myPosition: string;
        positionColor: string;
        positionCode: string;
        teamProfileUrl: string;
        isLeader: boolean;
        isFinished: boolean;
        createdAt: string;
        member: {
          nickName: string;
          userProfileUrl: string;
          leader: boolean;
        }[];
        myPositionExist: boolean;
        songNameExist: boolean;
      }[]
    | null;
  error: {
    errorCode: string;
    errorMessage: string;
  } | null;
}

// "data": [
//   {
//   "recordId": number, // 녹음 id
//   "title": string, // 녹음 파일명
//   "recordUrl": string, // 녹음파일 주소
//   "isPublic": boolean // 공개 비공개 여부
//   "startAt": number // 녹음 시작시점(초:밀리초)
//   "endAt": number // 녹음 종료시점 (초:밀리초)
//   "createAt": string // 녹음 일시
//   "teamId": number, // 녹음을 수행한 팀스페이스 id
//   "teamUrl": string, // 팀 프로필 이미지 주소
//   "songName": string // 노래 제목
//   "positionName": string, // 녹음한 파트이름
//   "colorCode": string // 컬러코드
//   },
// ]

export interface MainRecords {
  success: boolean;
  data: {
    recordId: number;
    title: string;
    recordUrl: string;
    public: boolean;
    startAt: string;
    createdAt: string;
    endAt: string;
    teamId: number;
    teamUrl: string;
    songName: string|null;
    positionName: string;
    colorCode: string;
  }[];
  error: {
    errorCode: string;
    errorMessage: string;
  } | null;
}
