"use client";

import React, { useState } from "react";
import { Button } from "antd";
import Swal from "sweetalert2";

// sweet alert 테스트용 컴포넌트, 차후 삭제 예정

export default function AlertTest() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  // 간단한 알림
  const handleAlert = () => {
    Swal.fire("안녕하세요!", "SweetAlert로 만든 알림입니다.", "info");
  };

  // 확인/취소 버튼이 있는 알림
  const handleConfirm = () => {
    Swal.fire({
      title: "정말 진행하시겠습니까?",
      text: "이 작업은 되돌릴 수 없습니다!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "예, 진행합니다!",
    }).then((result) => {
      if (result.isConfirmed) {
        setDone(true);
        Swal.fire("완료!", "작업이 성공적으로 수행되었습니다.", "success");
      } else {
        setDone(false);
        Swal.fire("취소", "작업이 취소되었습니다.", "error");
      }
    });
  };

  // 입력 폼이 있는 알림
  const handlePrompt = () => {
    Swal.fire({
      title: "이메일 주소를 입력하세요",
      input: "email",
      inputLabel: "이메일",
      inputPlaceholder: "email@example.com",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      inputValidator: (value) => {
        if (!value) {
            return "이메일 주소를 입력해주세요!";
          } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
            return "올바른 이메일 형식이 아닙니다.";
          }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setEmail(result.value);
        Swal.fire(`입력하신 이메일: ${result.value}`);
      } else {
        Swal.fire("취소", "이메일 입력이 취소되었습니다.", "error");
      }
    });
  };

  return (
    <div>
      <div className="p-8">
        <h3>sweet alert 테스트용</h3>
        <div className="flex gap-2 p-2 my-4">
          <Button onClick={handleAlert}>간단한 알림</Button>
          <Button onClick={handleConfirm}>확인 알림</Button>
          <Button onClick={handlePrompt}>이메일 입력 알림</Button>
        </div>
        <div className="">
          {done && <p>작업이 완료되었습니다.</p>}
          {email && <p><span>입력한 이메일: </span><span style={{ color: 'violet' }}>{email}</span></p>}
        </div>
      </div>
    </div>
  );
}
