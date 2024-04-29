'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { getMainTeams } from '@/services/home/mainTeams';
import {
  CrownFilled,
  PlusCircleOutlined,
} from '@ant-design/icons';
// import styles from './index.module.scss';
import { Avatar, Badge, Card, Tag, Tooltip } from 'antd';
import { Group } from 'antd/es/avatar';
import Image from 'next/image';
import Link from 'next/link';

interface IParams {
  teams: {
    id: number;
    name: string;
    song: string;
    myPosition: {
      position: string;
      color: string;
    };
    teamImg: string;
    members: {
      id: number;
      name: string;
      profileImg: string;
      isLeader: boolean;
    }[];
  }[];
}

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

export default function CardTeams({ teams }: IParams) {
  const [memNum, setMemNum] = useState(5);  // 너비에 따른 멤버 수 상태 변수
  const width = useViewportWidth();  // 너비 상태 변수
  //   const teams = await getMainTeams();

  useEffect(() => {
    if (width < 720) {  // 너비가 720px 미만일 때
      setMemNum(3);  // 멤버 수를 3명으로 설정
    } else if (width < 840) {  // 너비가 840px 미만일 때
      setMemNum(4);  // 멤버 수를 4명으로 설정
    } else {  // 일반 데스크탑 화면일 때
      setMemNum(5);  // 멤버 수를 5명으로 설정
    }
  }, [width]);  // 너비가 변경될 때마다 실행

  const router = useRouter();
  // console.log(teams);
  // const teams: {
  //     id: number;
  //     name: string;
  //     song: string;
  //     myPosition: {
  //         position: string;
  //         color: string;
  //     };
  //     teamImg: string;
  //     members: {
  //         id: number;
  //         name: string;
  //         profileImg: string;
  //     }[];
  // }[]

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-4 ">
        <Card
          style={{
            width: '32%',
            // marginTop: 16,
            textAlign: 'center',
            borderRadius: '10px',
            border: '3px solid #FFC500',
          }}
          className="flex justify-center text-center cursor-pointer"
          hoverable
          onClick={() => router.push('/create')}
        >
          <div className="flex flex-col justify-center items-center">
            <h1 className="m-6 text-amber-400">CREATE</h1>
            <PlusCircleOutlined style={{ fontSize: '100px', color: 'gold' }} />
          </div>
        </Card>
        {teams.map((team,i) => (
          <Link
            href={`/team/${team.id}`}
            key={i}
            style={{ width: '32%' }}
          >
            <Card
              style={{
                //   width: '32%',
                // marginTop: 16,
                height: '100%',
                textAlign: 'center',
                borderRadius: '10px',
                border: '3px solid #FFC500',
                backgroundColor: `${i % 2 === 0 ? 'rgb(255 251 235)': 'white'}`,
              }}
              title={team.name + 'asdsadasdsadasdas'}
              hoverable
            >
              <div className="flex mb-1">
                <Image src="svgs/note.svg" width={15} height={15} alt="음표" />
                <p className="flex w-full">
                  <span className="m-auto">{team.song}</span>
                </p>
              </div>
              <p>
                <Tag
                  style={{
                    border: `1px solid ${team.myPosition.color}`,
                    color: `${team.myPosition.color}`,
                    margin: '0.75rem 0',
                  }}
                  bordered={false}
                >
                  {team.myPosition.position}
                </Tag>
              </p>
              <Avatar
                src={team.teamImg}
                alt="팀"
                size={80}
                style={{ borderColor: '#FFC500' }}
              />
              <div className="flex mt-4 justify-center gap-1">
                <Group>
                  {team.members.slice(0, memNum).map((member,i) => (
                    <Badge
                      count={
                        member.isLeader ? (
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
                      <Tooltip placement="top" title={member.name} arrow={true}>
                        <Avatar
                          src={member.profileImg}
                          alt={member.name}
                          size={36}
                          style={{ borderColor: '#FFC500' }}
                        ></Avatar>
                      </Tooltip>
                    </Badge>
                  ))}
                  {team.members.length > memNum && (
                    <Avatar size={36} style={{ borderColor: '#FFC500' }}>
                      +{team.members.length - memNum}
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
