'use client'

import { Avatar, List, Menu, Dropdown, message } from 'antd';
import Item from 'antd/es/list/Item';
import { Meta } from 'antd/es/list/Item';
import Swal from 'sweetalert2';

interface IParams {
  members: {
    id: number;
    name: string;
    profileImg: string;
    isLeader: boolean;
  }[];
}

export default function TeamMemberList({ members }: IParams) {

  const handleMenuClick = async (memberId: number, action: string, memberName: string) => {
    if (action === 'remove_member') {
      // Show confirmation modal
      const result = await Swal.fire({
        title: `${memberName}님을 \n정말로 강퇴하시겠습니까?`,
        icon: 'warning',
        iconColor: 'red',
        customClass: {
          popup: 'swal2-warnpop'
        },
        showDenyButton: true,
        confirmButtonText: '예',
        denyButtonText: '아니오',
        confirmButtonColor: 'red',
        denyButtonColor: 'grey',  // Grey for the deny button
      });


      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/removeMember/${memberId}`, { method: 'DELETE' });
          if (!response.ok) throw new Error('Network response was not ok.');
          message.success('멤버가 강퇴되었습니다');
        } catch (error) {
          message.error('Failed to execute action.');
        }
      }
    } else if (action === 'change_position') {
      // Position change logic here
    }
  };

  const getMenu = (id: number, name: string) => (
    <Menu onClick={({ key }) => handleMenuClick(id, key, name)}>
      <Menu.Item key="change_position" style={{ fontWeight:'bold', textAlign: 'center' }}>포지션 변경</Menu.Item>
      <Menu.Item key="remove_member" style={{ fontWeight:'bold', color: 'red', textAlign: 'center' }}>
        멤버 강퇴
      </Menu.Item>
    </Menu>
  );

  return (
    <div className='overflow-auto'>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={members}
        renderItem={({ id, name, profileImg }) => (
          <Item>
            <Meta
              avatar={<Avatar src={'/' + profileImg} alt={name} size={36} />}
              title={
                <Dropdown overlay={getMenu(id, name)} trigger={['click']}>
                  <a onClick={e => e.preventDefault()}>{name}</a>
                </Dropdown>
              }
              description="Position"
            />
            <div>Position Details</div>
          </Item>
        )}
      />
    </div>
  );
}
