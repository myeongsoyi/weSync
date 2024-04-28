'use client';

import React, { useState } from 'react';

// import ReactDOM from 'react-dom'; 미지원으로 인한 수정
// swalRoot 타입 참조를 위해 Root 추가
import { createRoot, Root } from 'react-dom/client';

import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Space, Switch } from 'antd';
import { Button } from 'antd';
import Swal from 'sweetalert2';

// sweet alert 테스트용 컴포넌트, 차후 삭제 예정

// root 인스턴스를 저장할 변수
let swalRoot: Root | null = null;

export default function AlertTest() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  // 간단한 알림
  const handleAlert = () => {
    Swal.fire('안녕하세요!', 'SweetAlert로 만든 알림입니다.', 'info');
  };

  // 확인/취소 버튼이 있는 알림
  const handleConfirm = () => {
    Swal.fire({
      title: '정말 진행하시겠습니까?',
      text: '이 작업은 되돌릴 수 없습니다!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '예, 진행합니다!',
    }).then((result) => {
      if (result.isConfirmed) {
        setDone(true);
        Swal.fire('완료!', '작업이 성공적으로 수행되었습니다.', 'success');
      } else {
        setDone(false);
        Swal.fire('취소', '작업이 취소되었습니다.', 'error');
      }
    });
  };

  // 입력 폼이 있는 알림
  const handlePrompt = () => {
    Swal.fire({
      title: '이메일 주소를 입력하세요',
      input: 'email',
      inputLabel: '이메일',
      inputPlaceholder: 'email@example.com',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
      inputValidator: (value) => {
        if (!value) {
          return '이메일 주소를 입력해주세요!';
        } else if (
          !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
        ) {
          return '올바른 이메일 형식이 아닙니다.';
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setEmail(result.value);
        Swal.fire(`입력하신 이메일: ${result.value}`);
      } else {
        Swal.fire('취소', '이메일 입력이 취소되었습니다.', 'error');
      }
    });
  };

  // 배경색 테스트
  const handleBgColor = () => {
    Swal.fire({
      title: '커스텀 테스트',
      html: '<div id="antd-component" class="bg-pink-50"></div>', // AntD 컴포넌트를 마운트할 요소
      text: '배경색을 변경해보세요!',
      input: 'textarea',
      inputLabel: '배경색',
      inputPlaceholder: '#FFFFFF',
      showCancelButton: true,
      confirmButtonText: '확인했어요',
      cancelButtonText: '취소',
      buttonsStyling: false, // 사용자 정의 클래스
      focusConfirm: false, // 포커스 제어
      customClass: {
        confirmButton: 'swal-confirm-button', // 사용자 정의 클래스
        cancelButton: 'swal-cancel-button',
      },
      
      didOpen: () => {
        // ReactDom.render 대신 createRoot 사용
        // React 컴포넌트를 SweetAlert2의 HTML에 마운트
        const container = document.getElementById('antd-component');
        if (!container) return;

        // 이미 마운트된 root가 있는지 확인하고, 없으면 새로 생성
        if (!swalRoot) {
          swalRoot = createRoot(container);
        }

        swalRoot.render(
          <Space direction="vertical">
            <Button type="primary">AntD Button</Button>
            <Button type="primary">AntD Button</Button>
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              
              // defaultChecked
            />
          </Space>
        );
      },
      willClose: () => {
        // ReactDom.unmountComponentAtNode 대신 createRoot.unmount 사용
        // SweetAlert2 닫힐 때 마운트 해제
        if (swalRoot) {
          swalRoot.unmount();
          swalRoot = null; // 참조 초기화
        }
      },
      // background: "#121212",
    }).then((result) => {
      if (result.isConfirmed) {
        document.body.style.backgroundColor = result.value;
        Swal.fire(`배경색이 변경되었습니다.`);
      }
      // } else {
      //   Swal.fire("취소", "배경색 변경이 취소되었습니다.", "error");
      // }
    });
  };

  return (
    <div>
      <div className="p-8">
        <h3>sweet alert 테스트용</h3>
        <div className="flex gap-4 p-2 my-4 flex-wrap">
          <Button onClick={handleAlert}>간단한 알림</Button>
          <Button onClick={handleConfirm}>확인 알림</Button>
          <Button onClick={handlePrompt}>이메일 입력 알림</Button>
          <Button onClick={handleBgColor}>알림 컬러 테스트</Button>
        </div>
        <div className="">
          {done && <p>작업이 완료되었습니다.</p>}
          {email && (
            <p>
              <span>입력한 이메일: </span>
              <span style={{ color: 'violet' }}>{email}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
