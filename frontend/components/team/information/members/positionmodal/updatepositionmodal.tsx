'use client';

import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Select, message, Tag } from 'antd';
import { getPositionColors, putTeamPosition } from '@/services/team/information';

const { Option } = Select;

interface Colors {
  success: boolean;
  data:
    | {
        colorId: number;
        colorName: string;
        colorCode: string;
      }[]
    | null;
  error: {
    errorCode: string;
    errorMessage: string;
  } | null;
}
interface UpdatePositionModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: (
    positionId: number,
    newPosition: string,
    colorCode: string,
    colorId: number,
  ) => void;
  teamId: string;
  positionId: number;
  currentName: string;
  currentColorCode: string;
  currentColorId: number;
}

const UpdatePositionModal: React.FC<UpdatePositionModalProps> = ({
  open,
  onCancel,
  onSuccess,
//   teamId,
  positionId,
  currentName,
  currentColorCode,
  currentColorId,
}) => {
  const [positionName, setPositionName] = useState<string>(currentName);
  const [colors, setColors] = useState<Colors['data']>([]);
  const [selectedColorId, setSelectedColorId] = useState<number>(currentColorId);
  const [selectedColorCode, setSelectedColorCode] = useState<string>(currentColorCode);
  const [selectedColorName, setSelectedColorName] = useState<string>('');

  useEffect(() => {
    setPositionName(currentName);
    setSelectedColorId(currentColorId);
    setSelectedColorCode(currentColorCode);
    const fetchColors = async () => {
      const response = await getPositionColors();
      if (response.success) {
        setColors(response.data);
        const currentColor = response.data.find((color: { colorId: number; }) => color.colorId === currentColorId);
        if (currentColor) {
          setSelectedColorName(currentColor.colorName);
        }
      }
    };
    fetchColors();
  }, [positionId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length > 20) {
      message.error('최대 20자까지만 입력 가능합니다.');
    } else {
      setPositionName(newValue);
    }
  };

  const handleColorChange = (value: string) => {
    const selectedColor = colors?.find((color) => color.colorCode === value);
    if (selectedColor) {
      setSelectedColorId(selectedColor.colorId);
      setSelectedColorCode(selectedColor.colorCode);
      setSelectedColorName(selectedColor.colorName);
    }
  };

  const handleSubmit = async () => {
    if (!positionName.trim()) {
      message.error('포지션 이름을 입력해주세요.');
      return;
    }

    const response = await putTeamPosition(positionId, positionName, selectedColorId);
    if (!response.success) {
      message.error(response.error.errorMessage);
      return;
    } else {
      onSuccess(response.data.positionId, response.data.positionName, selectedColorCode, selectedColorId);
      message.success('포지션 수정 성공');
      window.location.reload();
      onCancel();
    }
  };

  return (
    <Modal
      style={{ textAlign: 'center' }}
      title="포지션 수정"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={250}
      footer={null}
      centered
      closable={false} // 'X' 표시 제거
    >
      <Input
        placeholder="포지션 이름 입력"
        value={positionName}
        onChange={handleInputChange}
        maxLength={20} // 입력 최대 길이 제한
        style={{ marginBottom: 10 }}
      />
      <Select
        value={selectedColorName}
        onChange={handleColorChange}
        style={{ width: '100%', marginBottom: 10 }}
      >
        {colors?.map((color, index) => (
          <Option key={index} value={color.colorCode}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  backgroundColor: `#${color.colorCode}`,
                  width: 20,
                  height: 20,
                  marginRight: 8,
                }}
              />
              {color.colorName}
            </div>
          </Option>
        ))}
      </Select>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Tag
          style={{
            display: 'inline-block',
            minWidth: '30px', // 최소 길이를 더 줄임
            maxWidth: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: positionName.length > 10 ? 'normal' : 'nowrap', // 10글자가 넘어가면 줄바꿈
            textAlign: 'center',
            color: `#${selectedColorCode}`,
            borderColor: `#${selectedColorCode}`,
            backgroundColor: `#${selectedColorCode}`,
            fontSize: '15px',
            marginBottom: '10px',
          }}
        >
          {positionName ? positionName : '미리보기'}
        </Tag>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Button key="cancel" onClick={onCancel} style={{ marginRight: 8 }}>
          취소
        </Button>
        <Button key="submit" type="primary" onClick={handleSubmit}>
          수정
        </Button>
      </div>
    </Modal>
  );
};

export default UpdatePositionModal;
