'use client';
import React, { useEffect, useState } from 'react';
import { Avatar, List, Dropdown, message, Tag, Badge } from 'antd';
import { Meta } from 'antd/es/list/Item';
import Swal from 'sweetalert2';
import PositionModal from '../positionmodal/changemodal';
import styles from './index.module.scss';
import { deleteTeamMember, getTeamMembers } from '@/services/team/information';
import { TeamMembers } from '@/types/teamDetail';
import { CrownFilled } from '@ant-design/icons';

interface IParams {
  teamId: string;
}

export default function TeamMemberList({ teamId }: IParams) {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [success, setSuccess] = useState<TeamMembers['success']>(true);
  const [members, setMembers] = useState<TeamMembers['data']>([]);
  const [error, setError] = useState<TeamMembers['error']>(null);

  const fetchMembers = async () => {
    const members = await getTeamMembers(teamId);
    setSuccess(members.success);
    setMembers(members.data);
    setError(members.error);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleMenuClick = async (
    memberId: number,
    action: string,
    memberName: string,
  ) => {
    if (action === 'remove_member') {
      const result = await Swal.fire({
        title: `${memberName}님을 \n정말로 강퇴하시겠습니까?`,
        icon: 'warning',
        iconColor: '#d33',
        showDenyButton: true,
        confirmButtonText: '예',
        denyButtonText: '아니오',
        confirmButtonColor: '#d33',
        denyButtonColor: 'grey',
        customClass: {
          popup: styles.borderRed,
        },
      });

      if (result.isConfirmed) {
        const response = await deleteTeamMember(memberId);
        if (response.success) {
          message.success('멤버가 강퇴되었습니다.');
          fetchMembers();
        } else {
          message.error('멤버 강퇴에 실패했습니다.');
        }
      }
    } else if (action === 'change_position') {
      setSelectedMemberId(memberId);
      setModalVisible(true);
    }
  };

  const handleModalOk = () => {
    setModalVisible(false);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  if (!success) {
    return (
      <div>
        <p>멤버 정보를 불러오는 중 오류가 발생했습니다.</p>
        <p>{error?.errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={members}
        renderItem={({
          teamUserId,
          nickName,
          userProfileUrl,
          positionName,
          colorCode,
          leader,
          positionExist,
        }) => (
          <List.Item>
            <Meta
              avatar={
                <Badge
                  count={
                    leader ? (
                      <CrownFilled
                        style={{ color: 'orange', fontSize: '21px' }}
                      />
                    ) : (
                      0
                    )
                  }
                  offset={[-22.5, -4]}
                >
                  <Avatar src={userProfileUrl} alt={nickName} size={45} />
                </Badge>
              }
              title={
                <Dropdown
                  trigger={['click']}
                  menu={{
                    items: [
                      {
                        key: 'change_position',
                        label: '포지션 할당',
                        onClick: () =>
                          handleMenuClick(
                            teamUserId,
                            'change_position',
                            nickName,
                          ),
                        style: { textAlign: 'center', fontWeight: 'bold' },
                      },
                      
                      {
                        key: 'remove_member',
                        label: '멤버 강퇴',
                        onClick: () =>
                          handleMenuClick(
                            teamUserId,
                            'remove_member',
                            nickName,
                          ),
                        style: {
                          textAlign: 'center',
                          color: 'red',
                          fontWeight: 'bold',
                        },
                      },
                    ],
                  }}
                >
                  <a onClick={(e) => e.preventDefault()}>{nickName}</a>
                </Dropdown>
              }
              description={leader ? '팀장' : '팀원'}
            />
            {positionExist ? (
              <Tag
                style={{
                  border: `1px solid #${colorCode}`,
                  color: `#${colorCode}`,
                  maxWidth: '40%',
                  minWidth: '20%',
                  padding: '2px',
                  textAlign: 'center',
                }}
                className="truncate"
              >
                <span>{positionName}</span>
              </Tag>
            ) : (
              <Tag
                style={{
                  border: `1px solid #121212`,
                  color: `#121212`,
                  maxWidth: '40%',
                  minWidth: '20%',
                  padding: '2px',
                  textAlign: 'center',
                }}
                className="truncate"
              >
                <span>미정</span>
              </Tag>
            )}
          </List.Item>
        )}
      />
      <PositionModal
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        selectedMemberId={selectedMemberId}
        fetchMembers={fetchMembers}
      />
    </div>
  );
}
