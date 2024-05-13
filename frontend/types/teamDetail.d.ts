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
