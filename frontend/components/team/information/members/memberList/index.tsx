'use client';
import React, { useState } from 'react';
import { Avatar, List, Dropdown, message } from 'antd';
import { Meta } from 'antd/es/list/Item';
import Swal from 'sweetalert2';
import PositionModal from '../positionmodal/changemodal';
import styles from './index.module.scss'

interface IParams {
  members: {
    id: number;
    name: string;
    profileImg: string;
    isLeader: boolean;
  }[];
}

export default function TeamMemberList({ members }: IParams) {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleMenuClick = async (memberId: number, action: string, memberName: string) => {
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
          popup: styles.borderRed
        }
      });
      

      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/removeMember/${memberId}`, {
            method: 'DELETE',
          });
          if (!response.ok) throw new Error('Network response was not ok.');
          message.success('멤버가 강퇴되었습니다.');
        } catch (error) {
          message.error('강퇴 실패. 관리자에게 문의하세요.');
        }
      }
    } else if (action === 'change_position') {
      setSelectedMemberId(memberId);
      setModalVisible(true);
    }
  };

  const handleModalOk = () => {
    setModalVisible(false);
    console.log('Position change confirmed for member ID:', selectedMemberId);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  return (
    <div className="overflow-auto">
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={members}
        renderItem={({ id, name, profileImg }) => (
          <List.Item>
            <Meta
              avatar={<Avatar src={'/' + profileImg} alt={name} size={36} />}
              title={
                <Dropdown
                  trigger={['click']}
                  menu={{
                    items: [
                      {
                        key: 'change_position',
                        label: '포지션 변경',
                        onClick: () => handleMenuClick(id, 'change_position', name),
                        style: { textAlign: 'center', fontWeight: 'bold' }
                      },
                      {
                        key: 'remove_member',
                        label: '멤버 강퇴',
                        onClick: () => handleMenuClick(id, 'remove_member', name),
                        style: { textAlign: 'center', color: 'red', fontWeight: 'bold' }
                      }
                    ]
                  }}
                >
                  <a onClick={(e) => e.preventDefault()}>{name}</a>
                </Dropdown>
              }
              description="Position"
            />
            <div>Position Details</div>
          </List.Item>
        )}
      />
      <PositionModal
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      />
    </div>
  );
}
