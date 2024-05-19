'use client';

import { useState, useEffect } from 'react';
import { getMainTeams } from '@/services/home';
import TeamCreate from '../../../team/information/teaminfomodal/createmodal';
import { MainActiveTeams } from '@/types/homeMain';
import { CrownFilled, PlusCircleOutlined } from '@ant-design/icons';
// import styles from './index.module.scss';
import { Avatar, Badge, Card, Tag, Tooltip } from 'antd';
import { Group } from 'antd/es/avatar';
import Image from 'next/image';
import Link from 'next/link';

// interface IParams {
//   teams: MainActiveTeams;
// }

function useViewportWidth() {
  const [width, setWidth] = useState(0); // 초기 너비 설정

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 초기 너비 설정 2
      setWidth(window.innerWidth);

      const handleResize = () => {
        setWidth(window.innerWidth); // 창 크기가 변경될 때 너비 업데이트
      };

      window.addEventListener('resize', handleResize); // 창 크기 변경 이벤트 리스너 추가

      return () => {
        window.removeEventListener('resize', handleResize); // 컴포넌트 언마운트 시 이벤트 리스너 제거
      };
    }
  }, []); // 의존성 배열을 비워서 컴포넌트 마운트 시에만 실행

  return width;
}

export default function CardTeams() {
  const [memNum, setMemNum] = useState(5); // 너비에 따른 멤버 수 상태 변수
  const width = useViewportWidth(); // 너비 상태 변수
  const [success, setSuccess] = useState<MainActiveTeams['success']>(true); // 성공 상태 변수
  const [data, setData] = useState<MainActiveTeams['data']>([]); // 데이터 상태 변수
  const [error, setError] = useState<MainActiveTeams['error']>(null); // 에러 상태 변수

  useEffect(() => {
    const fetchMainTeams = async () => {
      const teams = await getMainTeams();
      setSuccess(teams.success); // 성공 상태 변수 업데이트
      setData(teams.data); // 데이터 상태 변수 업데이트
      setError(teams.error); // 에러 상태 변수 업데이트
    };
    fetchMainTeams();
  }, []);

  useEffect(() => {
    if (width < 920) {
      // 너비가 920px 미만일 때
      setMemNum(4); // 멤버 수를 4명으로 설정
      // } else if (width < 840) {
      //   // 너비가 840px 미만일 때
      //   setMemNum(4); // 멤버 수를 4명으로 설정
    } else {
      // 일반 데스크탑 화면일 때
      setMemNum(5); // 멤버 수를 5명으로 설정
    }
  }, [width]); // 너비가 변경될 때마다 실행

  if (!success) {
    // api 요청 실패했을 경우...
    return (
      <div>
        <p>{error?.errorMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <Card
          style={{
            textAlign: 'center',
            borderRadius: '10px',
            border: '3px solid #FFC500',
            minHeight: '230px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className="flex justify-center text-center cursor-pointer"
          hoverable
          onClick={() => {
            TeamCreate();
          }}
        >
          <div className="flex flex-col justify-center items-center">
            <h1 className="m-6 text-amber-400">CREATE</h1>
            <PlusCircleOutlined style={{ fontSize: '100px', color: 'gold' }} />
          </div>
        </Card>
        {data?.map((team, i) => (
          <Link href={`/team/${team.teamId}/information`} key={i}>
            <Card
              style={{
                height: '100%',
                textAlign: 'center',
                borderRadius: '10px',
                border: '3px solid #FFC500',
                backgroundColor: `${i % 2 === 0 ? 'rgb(255 251 235)' : 'white'}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              hoverable
            >
              <h3 className='py-1'>{team.teamName}</h3>
              <div className="flex mb-1 justify-between">
                <Image
                  src="svgs/note.svg"
                  width={16}
                  height={16}
                  alt="음표"
                  className="h-auto"
                />
                <p className="flex w-full">
                  <span className="m-auto pr-4">{team.songName ?? '미정'}</span>
                </p>
              </div>
              {team.myPosition && (
                <p>
                  <Tag
                    style={{
                      border: `1px solid #${team.positionCode}`,
                      color: `#${team.positionCode}`,
                      margin: '0.5rem 0',
                    }}
                    bordered={false}
                  >
                    {team.myPosition}
                  </Tag>
                </p>
              )}
              <Avatar
                src={team.teamProfileUrl}
                alt="팀"
                size={80}
                style={{ borderColor: '#FFC500', margin: '0.5rem auto' }}
              />
              <div className="flex mt-4 justify-center gap-1">
                <Group>
                  {team.member.slice(0, memNum).map((member, i) => (
                    <Badge
                      count={
                        member.leader ? (
                          <CrownFilled
                            style={{ color: 'orange', fontSize: '24px' }}
                          />
                        ) : (
                          0
                        )
                      }
                      offset={[-18, -5]}
                      key={i}
                    >
                      <Tooltip
                        placement="top"
                        title={member.nickName}
                        arrow={true}
                      >
                        <Avatar
                          src={member.userProfileUrl}
                          alt={member.nickName}
                          size={36}
                          style={{ borderColor: '#FFC500' }}
                        ></Avatar>
                      </Tooltip>
                    </Badge>
                  ))}
                  {team.member.length > memNum && (
                    <Avatar size={36} style={{ borderColor: '#FFC500' }}>
                      +{team.member.length - memNum}
                    </Avatar>
                  )}
                </Group>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
