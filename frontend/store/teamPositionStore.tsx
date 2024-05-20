import { create } from 'zustand';
import { getTeamPosition } from '@/services/team/information';
interface TeamPositionState {
  positions: {
    positionId: number;
    positionName: string;
    colorCode: string;
    colorId: number;
  }[];
  setPositions: (
    positions: {
      positionId: number;
      positionName: string;
      colorCode: string;
      colorId: number;
    }[],
  ) => void;
  // getPositions: (teamId: string) => { positionId: number, positionName: string, colorCode: string, colorId: number }[];
  getPositions: (teamId: string) => Promise<void>;
}

// 차후 팀 ID 받아오도록 수정해야함.
export const useTeamPositionStore = create<TeamPositionState>((set) => ({
  positions: [],
  // set 함수를 통해 상태를 업데이트하는 함수
  setPositions: (positions) => {
    set({ positions });
  },
  // get 요청을 처리하는 함수
  getPositions: async (teamId) => {
    const response = await getTeamPosition(teamId);
    if (response.success) {
      set({ positions: response.data });
    }
  },
}));
