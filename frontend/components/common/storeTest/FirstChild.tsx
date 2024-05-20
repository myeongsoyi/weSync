// FirstChild.tsx
// zustand 스토어 예시 파일
'use client';

import React from "react";
import useStore from "@/store/store";
import { Button } from "antd";

function FirstChild() {
  const setSelectedButton = useStore((state) => state.setSelectedButton);
  const incrementCount = useStore((state) => state.incrementCount);
  const removeCount = useStore((state) => state.removeCount);

  const handleClick = (button: string) => {
    setSelectedButton(button);
  };

  return (
    <div>
      <h1>FirstChild</h1>
      <div>
        <Button onClick={() => handleClick("O")} className="m-4">O</Button>
        <Button onClick={() => handleClick("X")} className="m-4">X</Button>
      </div>
      <div>
        <Button onClick={incrementCount} className="m-4">카운트 증가</Button>
        <Button onClick={removeCount} className="m-4">카운트 리셋</Button>
      </div>
    </div>
  );
}

export default FirstChild;