'use client';

import { useState, useEffect } from 'react';
import styles from './index.module.scss';
// import { useRouter } from 'next/navigation';
import TeamCreate from '../../../team/information/teaminfomodal/createmodal';
import { CrownFilled, PlusCircleOutlined } from '@ant-design/icons';
import { Avatar, Badge, Card, Tag, Tooltip } from 'antd';
import { Group } from 'antd/es/avatar';
import Image from 'next/image';
import Link from 'next/link';
import { MyTotalTeams } from '@/types/myTeams';
import { getMyTeams } from '@/services/my-teams';
import { DateStringFormat } from '@/utils/format';

function useViewportWidth() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth);

      const handleResize = () => {
        setWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return width;
}

export default function CardTeams() {
  const [memNum, setMemNum] = useState(5);
  const [success, setSuccess] = useState<MyTotalTeams['success']>(true);
  const [data, setData] = useState<MyTotalTeams['data']>([]);
  const [error, setError] = useState<MyTotalTeams['error']>(null);
  const width = useViewportWidth();

  useEffect(() => {
    const fetchMainTeams = async () => {
      const teams = await getMyTeams();
      setSuccess(teams.success);
      setData(teams.data);
      setError(teams.error);
    };
    fetchMainTeams();
  }, []);

  useEffect(() => {
    if (width < 920) {
      setMemNum(4);
    } else {
      setMemNum(5);
    }
  }, [width]);

  if (!success) {
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
          }}
          className="flex justify-center items-center cursor-pointer"
          hoverable
          onClick={() => {
            TeamCreate();
          }}
        >
          <div className="flex flex-col justify-center items-center pb-2">
            <h1 className="mb-4 text-amber-400">CREATE</h1>
            <PlusCircleOutlined style={{ fontSize: '100px', color: 'gold' }} />
          </div>
        </Card>
        {data?.map((team, i) => (
          <div key={i} className={`${styles.cardContainer}`}>
            <Link href={`/team/${team.teamId}/information`}>
              {team.isFinished && (
                <div className={styles.isEndOverlay}>
                  <h1>종료</h1>
                  <h4>{DateStringFormat(team.createdAt)} ~</h4>
                </div>
              )}
              <Card
                style={{
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: '10px',
                  border: '3px solid #FFC500',
                  backgroundColor: `${i % 2 === 0 ? 'rgb(255 251 235)' : 'white'}`,
                }}
                title={team.teamName}
                hoverable
                className={`${i % 2 === 0 ? 'bg-amber-100' : 'bg-amber-50'} ${styles.card}`}
              >
                <div className="flex mb-1">
                  <Image
                    src="svgs/note.svg"
                    width={16}
                    height={16}
                    alt="음표"
                    className="h-auto"
                  />
                  <p className="flex w-full">
                    <span className="m-auto pr-4">
                      {team.songName ?? '미정'}
                    </span>
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
                  style={{
                    border: '3px solid #FFC500',
                    margin: '0.5rem auto',
                  }}
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
                            style={{ border: '2px solid #FFE27F' }}
                          ></Avatar>
                        </Tooltip>
                      </Badge>
                    ))}
                    {team.member.length > memNum && (
                      <Avatar size={36} style={{ border: '3px solid #FFC500' }}>
                        +{team.member.length - memNum}
                      </Avatar>
                    )}
                  </Group>
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
