'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
// import { getMainTeams } from '@/services/home/mainTeams';
import {
  CrownFilled,
  PlusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import styles from './index.module.scss';
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

export default async function CardTeams({ teams }: IParams) {
  //   const teams = await getMainTeams();

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
      <div className="flex gap-1 cursor-pointer my-4">
        <Link href="/team/list">
        <h2 className='font-extrabold'>TEAMS</h2>
        </Link>
        <PlusOutlined style={{ fontSize: '20px', fontWeight: 800 }} />
      </div>
      <h3>Ongoing</h3>
      <div className="flex flex-wrap gap-2 mt-4 ">
        <Card
          style={{
            width: '32%',
            // marginTop: 16,
            textAlign: 'center',
            borderRadius: '10px',
            border: '3px solid #FFC500',
            // height: '100%',
          }}
          className="bg-amber-50 flex justify-center text-center cursor-pointer"
          onClick={() => router.push('team/create')}
        >
          <div className="flex flex-col justify-center items-center">
            <h1 className="m-6 text-amber-400">CREATE</h1>
            <PlusCircleOutlined style={{ fontSize: '100px', color: 'gold' }} />
          </div>
        </Card>
        {teams.map((team) => (
          <Link
            href={`/team/${team.id}`}
            key={team.id}
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
              }}
              title={team.name + 'asdsadasdsadasdas'}
              hoverable
              className="even:bg-amber-100 odd:bg-amber-50"
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
                    margin: '4px 0px',
                  }}
                  bordered={false}
                >
                  {team.myPosition.position}
                </Tag>
              </p>
              <Avatar
                src={team.teamImg}
                alt="팀"
                size={64}
                style={{ borderColor: '#FFC500' }}
              />
              <div className="flex mt-4 justify-center gap-1">
                <Group>
                  {team.members.slice(0, 5).map((member) => (
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
                    >
                      <Tooltip placement="top" title={member.name} arrow={true}>
                        <Avatar
                          src={member.profileImg}
                          alt={member.name}
                          size={36}
                          key={member.id}
                          style={{ borderColor: '#FFC500' }}
                        ></Avatar>
                      </Tooltip>
                    </Badge>
                  ))}
                  {team.members.length > 5 && (
                    <Avatar size={36} style={{ borderColor: '#FFC500' }}>
                      +{team.members.length - 5}
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
