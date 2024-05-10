'use client';

import Image from 'next/image';
import React from 'react';
import { Layout, Button, Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import Link from 'next/link';

export default function HomePage() {
  const { Header } = Layout;

  const handleAlert = () => {
    Swal.fire({
      title: '로그아웃',
      text: '정말로 로그아웃 하시겠습니까?', 
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonColor: '#3085d6', 
      cancelButtonColor: '#d33',
      confirmButtonText: '예', 
      cancelButtonText: '아니오',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // 확인 버튼을 눌렀을 때 실행될 로직
        Swal.fire({title: '로그아웃 되었습니다', icon: 'success'})
        // api 로직 추가
      }
    });
  };

  return (
    <Layout style={{ backgroundColor: '#FFFFFF' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FFFFFF',
          height: '12vh',
          minHeight: '90px',
        }}
      >
        <Link href="/welcome">
          <Button type="primary">Welcome</Button>
        </Link>
        <Link href="/" style={{ width: 'auto', height: 'auto' }}>
          <Image
            src={'/svgs/logo.svg'}
            alt="로고"
            width={200}
            height={150}
            priority
            className="h-auto"
          />
        </Link>
        {/* <Menu
          // theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={items}
          style={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "center"}}
        /> */}
        <div className="flex flex-row items-center">
          <div className="mr-1">
            <Avatar size={40} icon={<UserOutlined />} />
          </div>
          <div className="flex flex-col items-center">
            <p className="text-center text-base text-gray-700 font-bold mt-2">
              이승연님
            </p>
            <Button type="text" size="small" onClick={handleAlert}>
              <p className="text-xs text-cente atext-amber-500 font-bold text-yellow-500">
                로그아웃
              </p>
            </Button>
          </div>
        </div>
      </Header>
    </Layout>
  );
}
