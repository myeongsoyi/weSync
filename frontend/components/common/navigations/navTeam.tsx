'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Button, Avatar, Dropdown, message, Popover } from 'antd';
import { SettingFilled, CaretDownOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import Link from 'next/link';
import Image from 'next/image';
import TeamModify from '@/components/team/information/teaminfomodal/modifymodal';
import type { MenuProps } from 'antd';
import styles from '@/components/team/information/members/memberList/index.module.scss';
import LoginComponent from '@/components/common/login';
import { usePathname, useRouter } from 'next/navigation';
import {
  getTeamInviteLink,
  getTeamDetail,
  deleteLeaveTeam,
  deleteRemoveTeam,
} from '@/services/team';
import { TeamDetail } from '@/types/teamDetail';

export default function TeamPage() {
  const [success, setSuccess] = useState<TeamDetail['success']>(true);
  const [teamDetail, setTeamDetail] = useState<TeamDetail['data']>(
    {} as TeamDetail['data'],
  );
  const [error, setError] = useState<TeamDetail['error']>(null);
  const [isLeader, setIsLeader] = useState(false);
  const pathname = usePathname();
  const teamId = pathname.split('/')[2];
  const { Header } = Layout;
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const fetchTeamDetail = async (teamId: string) => {
    const response = await getTeamDetail(teamId);
    if (response.success) {
      setSuccess(response.success);
      setTeamDetail(response.data);
      setIsLeader(response.data.teamLeader);
    } else {
      setSuccess(response.success);
      setError(response.error);
      Swal.fire({
        title: '팀 정보를 불러오는데 실패했습니다.',
        text: response.error.errorMessage,
        icon: 'error',
        confirmButtonColor: 'red',
        timer: 10000,
        timerProgressBar: true,
        willClose: () => router.replace('/'),
        // 빌드를 위해 추가한 코드
        didOpen: () => {
          console.warn(error);
        },
      });
    }
  };

  useEffect(() => {
    fetchTeamDetail(teamId);
  }, [pathname]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleMenuClick = async (key: string) => {
    if (key === 'leave-team') {
      Swal.fire({
        title: '정말로 팀을 떠나시겠습니까?',
        icon: 'warning',
        iconColor: '#d33',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '예 ',
        cancelButtonText: '아니오',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await deleteLeaveTeam(teamId);
          if (response.success) {
            message.success({
              content: '팀에서 나왔습니다.',
              duration: 2, // 메시지가 2초 후에 사라짐
            });
            router.push('/');
          } else {
            message.error(response.error.errorMessage);
          }
        }
      });
    } else if (key === 'create-invite-link') {
      const response = await getTeamInviteLink(teamId);
      if (response.success) {
        Swal.fire({
          title: '초대 링크 생성',
          html: `
      <textarea id="inviteLink" readonly style="width: 100%; height: 60px; border: none; background: white; text-align: center; overflow-y: hidden; resize: none;">
${response.data.url}</textarea>
    `,
          icon: 'info',
          confirmButtonColor: 'green',
          showCancelButton: true,
          confirmButtonText: '복사하기',
          cancelButtonText: '닫기',
          preConfirm: () => {
            const copyText = document.getElementById(
              'inviteLink',
            ) as HTMLTextAreaElement;
            copyText.select();
            document.execCommand('copy');

            Swal.fire({
              title: '복사 완료!',
              text: '초대 링크가 클립보드에 복사되었습니다.',
              icon: 'success',
              timer: 4000,
              timerProgressBar: true,
            });
          },
        });
      } else {
        Swal.fire({
          title: '초대 링크 생성 실패',
          text: response.error.errorMessage,
          icon: 'error',
          confirmButtonColor: 'red',
        });
      }
    } else if (key === 'edit-team-info') {
      if (teamDetail) {
        const songName = teamDetail.songNameExist ? teamDetail.songName : '';
        TeamModify(
          teamId,
          teamDetail.teamName,
          songName,
          teamDetail.teamProfileUrl,
          teamDetail.finished,
        );
      }
    } else if (key === 'delete-team') {
      Swal.fire({
        title: '정말로 팀을 삭제하시겠습니까?',
        icon: 'warning',
        iconColor: '#d33',
        customClass: { popup: styles.borderRed },
        input: 'text',
        inputLabel: '삭제된 정보는 복구되지 않습니다.',
        inputPlaceholder: '삭제하겠습니다.',
        inputValidator: (value) => {
          if (!value) {
            return '"삭제하겠습니다."를 입력해주세요';
          } else if (value !== '삭제하겠습니다.') {
            return '입력값이 잘못되었습니다';
          }
          return null;
        },
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: 'grey',
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await deleteRemoveTeam(teamId);
          if (response.success) {
            message.success({
              content: '팀이 삭제되었습니다.',
              duration: 2, // 메시지가 2초 후에 사라짐
            });
            router.push('/');
          } else {
            message.error(response.error.errorMessage);
          }
        }
      });
    }
  };

  const items: MenuProps['items'] = [
    {
      label: (
        <p
          style={{ fontWeight: 'bold', textAlign: 'center', cursor: 'pointer' }}
          onClick={() => handleMenuClick('create-invite-link')}
        >
          초대 링크 생성
        </p>
      ),
      key: 'create-invite-link',
    },
  ];

  if (isLeader) {
    items.push({
      label: (
        <p
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            color: 'blue',
            cursor: 'pointer',
          }}
          onClick={() => handleMenuClick('edit-team-info')}
        >
          팀 정보 변경
        </p>
      ),
      key: 'edit-team-info',
    });
  }

  items.push({
    label: (
      <p
        style={{
          fontWeight: 'bold',
          color: 'red',
          textAlign: 'center',
          cursor: 'pointer',
        }}
        onClick={() => handleMenuClick('leave-team')}
      >
        팀 나가기
      </p>
    ),
    key: 'leave-team',
  });

  if (isLeader) {
    items.push({
      label: (
        <p
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={() => handleMenuClick('delete-team')}
        >
          팀 삭제
        </p>
      ),
      key: 'delete-team',
      style: { backgroundColor: '#d33', color: 'white' },
    });
  }

  const content = (
    <div>
      {teamDetail?.activeTeams?.map((team, index) => (
        <div key={index} className="flex mt-1 first:mt-0">
          <div className="flex-col min-w-32">
            <p
              className="text-center text-gray-800 text-sm font-semibold"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                router.push(`/team/${team.teamId}/information`);
                setOpen(false); // 드롭다운 닫기
              }}
            >
              {team.teamName}
            </p>
            <p className="text-center text-gray-400 text-xs">{team.songName}</p>
          </div>
        </div>
      ))}
    </div>
  );

  if (!success) {
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
          <div
            className="flex-1"
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              minWidth: '170px',
            }}
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
                  width={170}
                  height={100}
                  className="h-auto"
                />
              </span>
            </Link>
          </div>

          {/* center */}
          <div className="flex flex-1 justify-center">
            <div className="flex flex-row">
              <div>
                <Avatar
                  size={55}
                  src={teamDetail?.teamProfileUrl ?? '/svgs/wesync_icon.svg'}
                  style={{
                    marginRight: '10px',
                    border: '3px solid #FFC500',
                  }}
                />{' '}
                {/* 간격 추가 */}
              </div>
              <div className="flex flex-col items-center">
                <Link href={`/team/${teamId}/information`}>
                  <p
                    className="text-4xl text-gray-700 font-bold"
                    style={{ whiteSpace: 'nowrap', cursor: 'pointer' }}
                  >
                    {teamDetail?.teamName ?? '팀 이름'}
                  </p>
                </Link>
                <p
                  className="text-sm text-gray-500 font-bold"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {teamDetail?.songName ?? '미정'}
                </p>

                <div
                  className="flex justify-center"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <Button
                    type="text"
                    style={{
                      padding: '0 10px',
                      fontSize: '20px',
                      color: 'gray',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CaretDownOutlined />
                  </Button>
                </div>
              </div>
            </div>
            <Button
              type="text"
              style={{ padding: '0 10px 5px', margin: 'auto 0' }}
            >
              <SettingFilled style={{ color: 'gray', fontSize: '20px' }} />
            </Button>
          </div>

          {/* end */}
          <div className="flex flex-1 justify-end">
            <LoginComponent />
          </div>
        </Header>
      </Layout>
    );
  }

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
        <div
          className="flex-1"
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            minWidth: '170px',
          }}
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
                width={170}
                height={100}
                className="h-auto"
              />
            </span>
          </Link>
        </div>

        {/* center */}
        <div className="flex flex-1 justify-center">
          <div className="flex flex-row">
            <div>
              <Avatar
                size={55}
                src={teamDetail?.teamProfileUrl}
                style={{
                  border: '3px solid #FFC500',
                }}
              />{' '}
              {/* 간격 추가 */}
            </div>
            <div className="flex flex-col items-center ml-3 mr-1">
              <Link href={`/team/${teamId}/information`}>
                <p
                  className="text-4xl text-gray-700 font-bold"
                  style={{ whiteSpace: 'nowrap', cursor: 'pointer' }}
                >
                  {teamDetail?.teamName ?? '팀 이름'}
                </p>
              </Link>
              <p
                className="text-sm text-gray-500 font-bold"
                style={{ whiteSpace: 'nowrap' }}
              >
                {teamDetail?.songName ?? '미정'}
              </p>

              <div
                className="flex justify-center"
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
                      fontSize: '20px',
                      color: 'gray',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CaretDownOutlined />
                  </Button>
                </Popover>
              </div>
            </div>
          </div>
          <Dropdown menu={{ items }} trigger={['click']}>
            <Button
              type="text"
              style={{ padding: '0 10px 5px', margin: 'auto 0' }}
            >
              <SettingFilled style={{ color: 'gray', fontSize: '20px' }} />
            </Button>
          </Dropdown>
        </div>

        {/* end */}
        <div className="flex flex-1 justify-end">
          <LoginComponent />
        </div>
      </Header>
    </Layout>
  );
}
