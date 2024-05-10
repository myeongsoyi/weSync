"use client";

import Image from "next/image";
import React from "react";
import { Layout, Button } from "antd";
// import Swal from "sweetalert2";
import Link from "next/link";
import LoginComponent from '@/components/common/login';

export default function HomePage() {
  const { Header } = Layout;

  // 간단한 알림
  // const handleAlert = () => {
  //   Swal.fire("안녕하세요!", "SweetAlert로 만든 알림입니다.", "info");
  // };

  return (
    <Layout style={{backgroundColor:'#FFFFFF'}}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#FFFFFF",
          height: '12vh',
          minHeight: '90px',
        }}
      >
        <Link href="/welcome" className="flex flex-1">
          <Button type="primary" >소개페이지</Button>
        </Link>
        <Link href="/" style={{width:'auto', height:'auto'}} className="flex flex-1 justify-center">
        <Image src={"/svgs/logo.svg"} alt="로고" width={200} height={150} priority className='h-auto' />
        </Link>
        {/* <Menu
          // theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={items}
          style={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "center"}}
        /> */}
        <div className="flex flex-1 justify-end">
          <LoginComponent />
        </div>
      </Header>
    </Layout>
  );
}
