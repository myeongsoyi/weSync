"use client";

import Image from "next/image";
import React from "react";
import { Layout, Button } from "antd";
import Link from "next/link";

export default function HomePage() {
  const { Header } = Layout;

  return (
    <Layout style={{backgroundColor:'#FFFFFF'}}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#FFFFFF",
          height: '100px',
        }}
      >
        <Link href="/welcome">
          <Button type="primary">Welcome</Button>
        </Link>
        <Link href="/">
        <Image src={"/svgs/logo.svg"} alt="로고" width={200} height={150} />
        </Link>
        {/* <Menu
          // theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={items}
          style={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "center"}}
        /> */}
        <Button type="primary" onClick={()=>alert('로그인 클릭')}>로그인</Button>
      </Header>
    </Layout>
  );
}
