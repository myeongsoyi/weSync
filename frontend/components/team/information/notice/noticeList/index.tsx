'use client';

// import React, { useEffect, useState } from 'react';
// import { Avatar, Button, List, Skeleton } from 'antd';
import { List } from 'antd';
import Item from 'antd/es/list/Item';
import { Meta } from 'antd/es/list/Item';

interface IParams {
  notices: {
    id: number;
    date: string;
    detail: string;
    pinned: boolean;
  }[];
}


export default function NoticeList({ notices }: IParams) {
  console.log(notices);


  return (
    <div className='h-96 overflow-auto px-5 py-2'>
      <List
        className="demo-loadmore-list"
        // loading={initLoading}
        itemLayout="horizontal"
        dataSource={notices}
        renderItem={(item) => (
          <Item>
            {/* <Skeleton avatar title={false} loading={item.} active> */}
            <Meta className=' text-center'
              title={<p>{item.detail}</p>}
              description={<p>{item.date}</p>}
            />
            {item.pinned ? <div>pinned</div> : <div>space</div> }
            {/* </Skeleton> */}
          </Item>
        )}
      />
    </div>
  );
}
