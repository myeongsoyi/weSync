'use client';

import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import { Layout, Button, Popover } from 'antd';
import Swal from 'sweetalert2';
import Link from 'next/link';

const teams = [
  {
    id: 1,
    name: 'Team1',
  },
  {
    id: 2,
    name: 'Team2',
  },
  {
    id: 3,
    name: 'Team3',
  },
  {
    id: 4,
    name: 'Team4',
  },
  {
    id: 5,
    name: 'Team5',
  },
];

export default function TeamPage() {
  const { Header } = Layout;

  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const [arrow, setArrow] = useState('Show');

  const mergedArrow = useMemo(() => {
    if (arrow === 'Hide') {
      return false;
    }

    return {
      pointAtCenter: true,
    };
  }, [arrow]);

  const content = (
    <div>
      {teams.map((team) => (
        <p>
        <Link href={`/teams/${team.id}`}>{team.name}</Link>
        </p>
      ))}
    </div>
  );

  // 간단한 알림
  const handleAlert = () => {
    Swal.fire('로그아웃', '정말로 로그아웃 하시겠습니까?', 'warning');
  };

  return (
    <Layout style={{ backgroundColor: '#FFFFFF' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FFFFFF',
          height: '100px',
        }}
      >
        <Link href="/">
          <Image src={'/svgs/logo.svg'} alt="로고" width={150} height={100} />
        </Link>
        <Link href="/team">
          <p>Team Name</p>
          <Popover
            content = {content}
            arrow={mergedArrow}
            title="Title"
            trigger="click"
            placement="bottom"
            open={open}
            onOpenChange={handleOpenChange}
          >
            ▼
          </Popover>
        </Link>
        <Button type="primary" onClick={handleAlert}>
          로그아웃
        </Button>
      </Header>
    </Layout>
  );
}
