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
//   "teamId": number, // 녹음을 수행한 팀스페이스 id
//   "teamUrl": string, // 팀 프로필 이미지 주소
//   "songName": string // 노래 제목
//   "positionName": string, // 녹음한 파트이름
//   "startAt": number // 노래에서 녹음이 시작되는 시간(밀리초)
//   "createAt": string // 녹음 일시
//   },
// ]

export interface MainRecords {
  success: boolean;
  data: {
    recordId: number;
    title: string;
    recordUrl: string;
    teamId: number;
    teamUrl: string;
    songName: string;
    positionName: string;
    colorCode: string;
    startAt: number;
    endAt: number;
    createAt: string;
  }[];
  error: {
    errorCode: string;
    errorMessage: string;
  } | null;
}
