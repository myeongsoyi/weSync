export interface PositionColors {
  success: boolean;
  data:
    | {
        colorId: number;
        colorName: string;
        colorCode: string;
      }[]
    | null;
  error: {
    errorCode: string;
    errorMessage: string;
  } | null;
}

export interface CreateTeam {
  success: boolean;
  data: {
    teamId: number;
  } | null;
  error: {
    errorCode: string;
    errorMessage: string;
  } | null;
}

export interface TeamDetail {
  success: boolean;
  data:
    | {
        finished: boolean;
        teamId: number;
        teamName: string;
        songName: string;
        teamProfileUrl: string;
        activeTeams: {
          teamId: number;
          teamName: string;
          songName: string;
          teamProfileUrl: string;
          songNameExist: boolean;
        }[];
        teamLeader: boolean;
        songNameExist: boolean;
      }
    | null;
  error: {
    errorCode: string;
    errorMessage: string;
  } | null;
}

