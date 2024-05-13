export interface MyTotalTeams {
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
