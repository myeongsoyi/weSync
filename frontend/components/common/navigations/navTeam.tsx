'use client';

import React, { useState } from 'react';
import { Layout, Button, Avatar, Menu, Dropdown, message, Popover } from 'antd';
import { UserOutlined, SettingFilled } from '@ant-design/icons';
import Swal from 'sweetalert2';
import Link from 'next/link';
import Image from 'next/image';
import { MenuInfo } from 'rc-menu/lib/interface';
import TeamModify from '@/components/team/information/teaminfomodal/modifymodal';

interface Team {
  id: number;
  name: string;
  song: string;
}

const teams: Team[] = [
  { id: 1, name: 'Team1', song: 'Song1' },
  { id: 2, name: 'Bellcanto', song: 'Song2' },
  { id: 3, name: '안녕', song: 'Song3' },
  { id: 4, name: 'a', song: 'Song4' },
  { id: 5, name: 'Team5', song: 'Song5' },
];

export default function TeamPage() {
  const { Header } = Layout;

  const [open, setOpen] = useState(false);
  const [positions] = useState([]);
  const [currentTeamId] = useState<number>(1); // 초기 팀 ID 설정

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const handleMenuClick = async (e: MenuInfo) => {
    const { key } = e;

    if (key === 'leave-team') {
      // 팀 떠나기에 대한 간단한 확인
      Swal.fire({
        title: '정말로 팀을 떠나시겠습니까?',
        icon: 'warning',
        iconColor: 'red',
        showCancelButton: true,
        confirmButtonColor: 'red',
        cancelButtonColor: 'grey',
        confirmButtonText: '예 ',
        cancelButtonText: '아니오',
      }).then((result) => {
        if (result.isConfirmed) {
          // 팀 떠나기 로직 처리
          message.success('Team left successfully.');
        }
      });
    } else if (key === 'edit-team-info') {
      const currentTeam = teams.find((t) => t.id === currentTeamId);
      if (currentTeam) {
        TeamModify(
          currentTeam.name,
          currentTeam.song,
          'path/to/current-team-image.jpg',
        );
      }
    } else if (key === 'delete-team') {
      // 팀 삭제하기에 대한 보다 엄격한 확인
      Swal.fire({
        title: '정말로 팀을 삭제하시겠습니까?',
        icon: 'warning',
        iconColor: 'red',
        customClass: {
          popup: 'swal2-warnpop',
        },
        input: 'text',
        inputLabel: '삭제된 정보는 복구되지 않습니다.',
        inputPlaceholder: '삭제하겠습니다',
        inputValidator: (value) => {
          if (!value) {
            return '"삭제하겠습니다"를 입력해주세요';
          } else if (value !== '삭제하겠습니다') {
            return '입력값이 잘못되었습니다';
          }
          return null;
        },
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: 'grey',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          // 팀 삭제 로직 처리
          message.success('Team deleted successfully.');
        }
      });
    }
  };

  const settingsMenu = (
    <Menu onClick={handleMenuClick} style={{ textAlign: 'center' }}>
      <Menu.Item key="create-invite-link" style={{ fontWeight: 'bold' }}>
        초대 링크 생성
      </Menu.Item>
      <Menu.Item
        key="set-position"
        disabled={positions.length === 0}
        style={{ fontWeight: 'bold' }}
      >
        내 포지션 설정
      </Menu.Item>
      <Menu.Item
        key="edit-team-info"
        style={{ fontWeight: 'bold', color: 'blue' }}
      >
        팀 정보 변경
      </Menu.Item>
      <Menu.Item key="leave-team" style={{ fontWeight: 'bold', color: 'red' }}>
        팀 나가기
      </Menu.Item>
      <Menu.Item
        key="delete-team"
        style={{ color: 'white', fontWeight: 'bold', backgroundColor: 'red' }}
      >
        팀 삭제
      </Menu.Item>
    </Menu>
  );

  const content = (
    <div>
      {teams.map((team, index) => (
        <p key={index} className="flex mt-1 first:mt-0">
          <Link className="m-auto" href={`/team/${team.id}/information`}>
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
          minHeight: '90px',
        }}
      >
        <div
          className="flex-1"
          style={{ display: 'flex', alignItems: 'center', height: '100%' }}
        >
          <Link href="/" passHref>
            <span
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Image
                src={'/svgs/logo.svg'}
                alt="로고"
                width={130}
                height={100}
              />
            </span>
          </Link>
        </div>

        {/* center */}
        <div className="flex flex-1 justify-center">
          <div className="flex flex-row">
            <div>
              <Avatar size={55} icon={<UserOutlined />} />
            </div>
            <div className="flex-row">
              <Link href={`/team/${currentTeamId}/information`}>
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
          </div>
          <Dropdown overlay={settingsMenu} trigger={['click']}>
            <Button type="text" style={{ padding: '0 10px' }}>
              <SettingFilled style={{ color: 'gray', fontSize: '20px' }} />
            </Button>
          </Dropdown>
        </div>

        {/* end */}
        <div className="flex flex-1 justify-end items-center">
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
        </div>
      </Header>
    </Layout>
  );
}
