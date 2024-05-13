import React, { useState } from 'react';
import { Modal, Input, Button, Select, message, Tag } from 'antd';
const { Option } = Select;

interface Colors {
  [key: string]: string;
}

const colors: Colors = {
  Pink: '#ff59e9',
  Red: '#FF0000',
  Orange: '#ff7700',
  Brown: '#705400',
  Green: '#007025',
  Blue: '#0a5cff',
  Navy: '#000080',
  Purple: '#8c00ff',
  Gray: '#878787',
  Black: '#000000',
};

interface NewPositionModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: (newPosition: string, color: string) => void;
}

const NewPositionModal: React.FC<NewPositionModalProps> = ({
  open,
  onCancel,
  onSuccess,
}) => {
  const [positionName, setPositionName] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length > 20) {
      message.error('최대 20자까지만 입력 가능합니다.');
    } else {
      setPositionName(newValue);
    }
  };

  const [selectedColor, setSelectedColor] = useState<string>('Pink');

  const handleSubmit = async () => {
    if (!positionName.trim()) {
      message.error('포지션 이름을 입력해주세요.');
      return;
    }
  
    onSuccess(positionName, colors[selectedColor]);
    message.success('새 포지션 등록 성공');
    setPositionName('');
    setSelectedColor('Pink');
    onCancel();
  };

  return (
    <Modal style={{ textAlign: 'center'}}
      title="새 포지션 생성"
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
        value={selectedColor}
        onChange={setSelectedColor}
        style={{ width: '100%', marginBottom: 10 }}
      >
        {Object.entries(colors).map(([key, value]) => (
          <Option key={key} value={key}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  backgroundColor: value,
                  width: 20,
                  height: 20,
                  marginRight: 8,
                }}
              />
              {key}
            </div>
          </Option>
        ))}
      </Select>

      {positionName && (
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
              color: colors[selectedColor],
              borderColor: colors[selectedColor],
              backgroundColor: colors[selectedColor],
              fontSize: '15px',
              marginBottom: '10px',
            }}
          >
            {positionName}
          </Tag>
        </div>
      )}

      <div style={{ textAlign: 'center' }}>
        <Button key="cancel" onClick={onCancel} style={{ marginRight: 8 }}>
          취소
        </Button>
        <Button key="submit" type="primary" onClick={handleSubmit}>
          등록
        </Button>
      </div>
    </Modal>
  );
};

export default NewPositionModal;
