'use client';

import Image from "next/image";
import React from 'react';
import { Breadcrumb, Layout, Menu, Button } from 'antd';

export default function HomePage() {
  const { Header, Content, Footer } = Layout;

const items = new Array(15).fill(null).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

// const App: React.FC = () => {
  // const {
  //   token: { colorBgContainer, borderRadiusLG },
  // } = theme.useToken();

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF' }}>
        <Image src={"/svgs/logo.svg"} alt="로고" width={150} height={100} />
        <Menu
          // theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
        <Button type="primary">Button</Button>
      </Header>
      <Content style={{ padding: '0 10%' }}>
        {/* <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb> */}
        <div
          style={{
            // background: colorBgContainer,
            minHeight: 300,
            height: '85vh', 
            padding: 12,
            // borderRadius: borderRadiusLG,
          }}
        >
          <span>Content</span>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', color: 'white', background: 'darkblue' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
}
