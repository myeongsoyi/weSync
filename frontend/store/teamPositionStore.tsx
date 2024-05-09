import { create } from 'zustand';

interface TeamPositionState {
  positions: { name: string; color: string }[];
  getPositions: () => { name: string; color: string }[];
  addPosition: (name: string, color: string) => void;
  deletePosition: (name: string) => void;
}

// 차후 팀 ID 받아오도록 수정해야함.
export const useTeamPositionStore = create<TeamPositionState>((set, get) => ({
  positions: [
    { name: '소프라노', color: '#f50' },
    { name: '알토', color: '#2db7f5' },
    { name: '바리톤', color: '#87d068' },
    { name: '테너', color: '#108ee9' },
  ],
  // get 요청을 처리하는 함수
  getPositions: () => {
    return get().positions;
  },
  // post 요청을 보내고 응답을 받아 set 함수를 통해 상태를 업데이트하자.
  addPosition: (name, color) => {
    // 이전 상태의 positions 배열을 가져와 새 position 객체를 추가합니다.
    const newPositions = [...get().positions, { name, color }];
    set({ positions: newPositions });
  },
  deletePosition: (name) => {
    const newPositions = get().positions.filter((pos) => pos.name !== name);
    set({ positions: newPositions });
  }
}));
