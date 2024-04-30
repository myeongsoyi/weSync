'use client';

import { Avatar, List} from 'antd';
import Item from 'antd/es/list/Item';
import { Meta } from 'antd/es/list/Item';
// interface DataType {
//   gender?: string;
//   name: {
//     title?: string;
//     first?: string;
//     last?: string;
//   };
//   email?: string;
//   picture: {
//     large?: string;
//     medium?: string;
//     thumbnail?: string;
//   };
//   nat?: string;
//   loading: boolean;
// }

interface IParams {
  members: {
    id: number;
    name: string;
    profileImg: string;
    isLeader: boolean;
  }[];
}


export default function TeamMemberList({ members }: IParams) {
  console.log(members);

  //   const loadMore =
  //     !initLoading && !loading ? (
  //       <div
  //         style={{
  //           textAlign: 'center',
  //           marginTop: 12,
  //           height: 32,
  //           lineHeight: '32px',
  //         }}
  //       >
  //         <Button onClick={onLoadMore}>loading more</Button>
  //       </div>
  //     ) : null;

  return (
    <div className='h-96 overflow-auto'>
      <List
        className="demo-loadmore-list"
        // loading={initLoading}
        itemLayout="horizontal"
        dataSource={members}
        renderItem={(item) => (
          <Item>
            {/* <Skeleton avatar title={false} loading={item.} active> */}
            <Meta
              avatar={
                <Avatar alt={item.name} size={36}/>
              }
              title={<a>{item.name}</a>}
              description="position"
            />
            <div>postion</div>
            {/* </Skeleton> */}
          </Item>
        )}
      />
    </div>
  );
}
