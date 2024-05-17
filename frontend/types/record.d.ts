export interface ScoreResponse {
  success: boolean;
  data: {
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
