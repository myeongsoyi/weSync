'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Avatar, Button, Table, Tag, Tooltip, message } from 'antd';
import { MainRecords } from '@/types/homeMain';
import { getMainRecords } from '@/services/home';
import { putChangeRecordPublic, deleteRecord } from '@/services/team/record';
import {
  CloseCircleOutlined,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';

export default function ListRecord() {
  const [success, setSuccess] = useState<MainRecords['success']>(true);
  const [records, setRecords] = useState<MainRecords['data']>([]);
  const [error, setError] = useState<MainRecords['error']>(null);

  const { Column } = Table;

  const fetchRecords = async () => {
    try {
      const response = await getMainRecords();
      if (response.success) {
        setRecords(response.data);
        setSuccess(true);
      } else {
        setError(response.error);
        setSuccess(false);
      }
    } catch (err) {
      message.error('데이터를 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handlePublic = async (recordId: number, isPublic: boolean) => {
    Swal.fire({
      title: isPublic ? '공유를 취소합니다.' : '공유를 시작합니다.',
      text: isPublic
        ? '다른 사용자가 이 녹음을 볼 수 없습니다.'
        : '다른 사용자가 이 녹음을 볼 수 있습니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await putChangeRecordPublic(recordId);
          if (response.success) {
            const msg = isPublic
              ? '공유가 취소되었습니다.'
              : '공유가 시작되었습니다.';
            message.success(msg);
            fetchRecords();
          } else {
            message.error(response.error?.errorMessage);
          }
        } catch (err) {
          message.error('공유 상태 변경에 실패했습니다.');
        }
      }
    });
  };

  const handleDelete = async (recordId: number, title: string | null) => {
    Swal.fire({
      title: '이 녹음을 삭제합니다.',
      text: title ?? '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: 'grey',
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteRecord(recordId);
          if (response.success) {
            message.success('녹음이 삭제되었습니다.');
            fetchRecords();
          } else {
            message.error('녹음 삭제에 실패했습니다.');
          }
        } catch (err) {
          message.error('녹음 삭제에 실패했습니다.');
        }
      }
    });
  };

  if (!success) {
    return (
      <div>
        <h2>데이터를 불러오는데 실패했습니다.</h2>
        <h2>{error?.errorMessage}</h2>
      </div>
    );
  }

  return (
    <Table dataSource={records} pagination={false} rowKey="recordId">
      <Column
        title="팀"
        dataIndex="songName"
        key="songName"
        render={(songName, record: MainRecords['data'][number]) => (
          <a href={`/team/${record.teamId}/workspace`}>
            <Tooltip placement="top" title={songName} arrow={true}>
              <Avatar
                src={record.teamUrl}
                alt="팀"
                size={45}
                style={{ borderColor: '#FFC500' }}
              />
            </Tooltip>
          </a>
        )}
      />
      <Column
        title="포지션"
        key="positionName"
        render={(record: MainRecords['data'][number]) => (
          <Tag
            style={{
              border: `1px solid #${record.colorCode}`,
              color: `#${record.colorCode}`,
              margin: '4px 0px',
            }}
          >
            {record.positionName}
          </Tag>
        )}
      />
      <Column title="제목" dataIndex="title" key="title" />
      <Column
        title="저장 일시"
        dataIndex="createdAt"
        key="createdAt"
        render={(createdAt: string) => {
          const date = new Date(createdAt);
          const formattedDate = date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'Asia/Seoul',
          });
          const formattedTime = date.toLocaleTimeString('ko-KR', {
            hour: 'numeric',
            minute: '2-digit',
            // second: '2-digit',
            timeZone: 'Asia/Seoul',
          });
          return (
            <>
              <Tag color="blue">{formattedDate}</Tag>
              <br />
              <Tag color="green">{formattedTime}</Tag>
            </>
          );
        }}
      />
      <Column
        title="비고"
        dataIndex="public"
        key="public"
        render={(isPublic, record: MainRecords['data'][number]) => {
          return (
            <div className="flex">
              <Tooltip
                placement="top"
                title={isPublic ? '공유 취소' : '공유하기'}
                arrow={true}
              >
                <Button
                  type="text"
                  onClick={() => handlePublic(record.recordId, isPublic)}
                >
                  {isPublic ? (
                    <DownloadOutlined
                      style={{
                        color: 'green',
                        fontSize: '1.2rem',
                        margin: 'auto',
                      }}
                    />
                  ) : (
                    <UploadOutlined
                      style={{ color: 'blue', fontSize: '1.2rem' }}
                    />
                  )}
                </Button>
              </Tooltip>
              <Tooltip placement="top" title={'삭제'} arrow={true}>
                <Button
                  type="text"
                  onClick={() => handleDelete(record.recordId, record.title)}
                >
                  <CloseCircleOutlined
                    style={{ color: 'red', fontSize: '1.2rem' }}
                  />
                </Button>
              </Tooltip>
            </div>
          );
        }}
      />
    </Table>
  );
}
