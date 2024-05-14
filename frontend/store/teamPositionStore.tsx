import { create } from 'zustand';

interface TeamPositionState {
  positions: { positionId: number, positionName: string, colorCode: string }[];
  setPositions: (positions: { positionId: number, positionName: string, colorCode: string }[]) => void;
  getPositions: () => { positionId: number, positionName: string, colorCode: string }[];
  addPosition: (positionId: number, positionName: string, colorCode: string) => void;
  deletePosition: (positionId: number) => void;
}

// 차후 팀 ID 받아오도록 수정해야함.
export const useTeamPositionStore = create<TeamPositionState>((set, get) => ({
  positions: [],
  // set 함수를 통해 상태를 업데이트하는 함수
  setPositions: (positions) => {
    set({ positions });
  },
  // get 요청을 처리하는 함수
  getPositions: () => {
    return get().positions;
  },
  // post 요청을 보내고 응답을 받아 set 함수를 통해 상태를 업데이트하자.
  addPosition: (positionId: number, positionName: string, colorCode: string) => {
    // 이전 상태의 positions 배열을 가져와 새 position 객체를 추가합니다.
    const newPositions = [...get().positions, { positionId, positionName, colorCode }];
    set({ positions: newPositions });
  },
  deletePosition: (positionId: number) => {
    const newPositions = get().positions.filter((pos) => pos.positionId !== positionId);
    set({ positions: newPositions });
  }
}));
