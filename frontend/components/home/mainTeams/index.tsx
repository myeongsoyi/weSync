import React from 'react';
import { getMainTeams } from '@/services/home/mainTeams';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
import { Avatar, Card, Tag } from 'antd';
import Image from 'next/image';

export default async function MainTeams() {
  const teams = await getMainTeams();
  console.log(teams);
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
    <div className={styles.outer}>
      <div className="flex gap-1 cursor-pointer my-4">
        <h1>TEAMS</h1>
        <PlusOutlined style={{ fontSize: '24px' }} />
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
            height: '100px',
          }}
          className="bg-amber-50"
        ></Card>
        {teams.map((team) => (
          <Card
            style={{
              width: '32%',
              //   marginTop: 16,
              textAlign: 'center',
              borderRadius: '10px',
              border: '3px solid #FFC500',
            }}
            key={team.id}
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
            <Avatar src={team.teamImg} alt='팀' size={64} style={{borderColor: '#FFC500'}}/>
            <div className='flex mt-4 justify-center gap-2'>
                {team.members.map((member) => (
                    <Avatar src={member.profileImg} alt={member.name} size={32} key={member.id} style={{borderColor: '#FFC500'}}/>
                ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
