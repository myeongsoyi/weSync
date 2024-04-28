'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { Layout, Button, Popover, Avatar } from 'antd';
import { UserOutlined, SettingFilled } from '@ant-design/icons';
import Swal from 'sweetalert2';
import Link from 'next/link';

const teams = [
  {
    id: 1,
    name: 'Team1',
    song: 'Song1',
  },
  {
    id: 2,
    name: 'Bellcanto',
    song: 'Song2',
  },
  {
    id: 3,
    name: '안녕',
    song: 'Song3',
  },
  {
    id: 4,
    name: 'a',
    song: 'Song4',
  },
  {
    id: 5,
    name: 'Team5',
    song: 'Song5',
  },
];

export default function TeamPage() {
  const { Header } = Layout;

  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const content = (
    <div>
      {teams.map((team, index) => (
        <p key={index} className="flex mt-1 first:mt-0">
          <Link className="m-auto" href={`/teams/${team.id}`}>
            <div className="flex-col min-w-32">
              <p className="text-center  text-gray-800  text-sm font-semibold">
                {team.name}
              </p>
              <p className="text-center text-gray-400 text-xs">{team.song}</p>
            </div>
          </Link>
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
        className="flex"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFFFFF',
          height: '12vh',
        }}
      >
        <div className="flex-1">
          <Link href="/">
            <Image src={'/svgs/logo.svg'} alt="로고" width={130} height={100} />
          </Link>
        </div>

        {/* center */}
        <div className="flex flex-1 justify-center">
          <div className="flex flex-row">
            <div>
              <Avatar size={55} icon={<UserOutlined />} />
            </div>
            <div className="flex-row">
              <Link href="/team">
                <p className="text-center text-3xl text-gray-700 font-bold w-40">
                  ACAROA
                </p>
                <p className="text-center text-xs text-gray-500 font-bold w-40">
                  깊은 밤을 날아서
                </p>
              </Link>
              <div
                className="flex justify-center w-40"
                style={{ whiteSpace: 'nowrap' }}
              >
                <Popover
                  content={content}
                  arrow={false}
                  trigger="click"
                  placement="bottom"
                  open={open}
                  onOpenChange={handleOpenChange}
                >
                  <Button
                    type="text"
                    style={{
                      padding: '0 10px',
                      fontSize: '12px',
                      height: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ▼
                  </Button>
                </Popover>
              </div>
            </div>
            <div>
              <Button
                type="text"
                style={{
                  padding: '0 10px',
                }}
              >
                <SettingFilled style={{ color: 'gray', fontSize: '20px' }} />
              </Button>
            </div>
          </div>
        </div>

        {/* end */}
        <div className="flex flex-1 justify-end items-center">
          <div className="flex flex-row intems-center">
            <div className='mr-1'>
              <Avatar size={40} icon={<UserOutlined />} />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-center text-base text-gray-700 font-bold mt-2">
                이승연님
              </p>
              <Button type="text" size="small" onClick={handleAlert}>
                <p className="text-xs text-cente text-amber-500 font-bold">
                  로그아웃
                </p>
              </Button>
            </div>
          </div>
        </div>
      </Header>
    </Layout>
  );
}
