// SecondChild.tsx
// zustand 스토어 예시 파일
'use client';

import React from "react";
import useStore from "@/store/store";

function SecondChild() {
  const selectedButton = useStore((state) => state.selectedButton);
  const count = useStore((state) => state.count);

  return (
    <div>
      <h1>SecondChild</h1>
      <p>카운트: {count}</p>
      <p>선택한 버튼: {selectedButton}</p>
    </div>
  );
}

export default SecondChild;