export interface ScoreResponse {
  success: boolean;
  data: {
    score_id: number;
    score_url: string;
    accompaniment_url: string;
    position_name: string | null;
    color_code: string | null;
  }[];
  error: {
    errorCode: string;
    errorMessage: string;
  } | null;
}

export interface RecordAll {
  success: boolean;
  data: {
    recordId: number;
    title: string;
    recordUrl: string;
    userId: number;
    public: boolean;
    startAt: string;
    endAt: string;
    createdAt: string;
    nickname: string;
    positionId: number;
    positionName: string;
    colorCode: string;
  }[];
  error: {
    errorCode: string;
    errorMessage: string;
  } | null;
}

export interface RecordMy {
  success: boolean;
  data: {
    recordId: number;
    title: string;
    recordUrl: string;
    userId: number;
    startAt: string;
    endAt: string;
    createdAt: string;
    positionId: number;
    positionName: string;
    colorCode: string;
  }[];
  error: {
    errorCode: string;
    errorMessage: string;
  } | null;
}

export interface RecordFiltered {
  success: boolean;
  data: {
    recordId: number;
    title: string;
    recordUrl: string;
    userId: number;
    startAt: string;
    endAt: string;
    createdAt: string;
    nickname: string;
    positionId: number;
    positionName: string;
    colorCode: string;
  }[];
  error: {
    errorCode: string;
    errorMessage: string;
  } | null;
}
