// 'use client';

// import { useState } from 'react';
// import styles from './index.module.scss';
// import { Button} from 'antd';
// import PositionModal from '../positionBox/scorePositionModal';


// export default function PositionAdd() {
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

//   const openModal = (positionId: number) => {
//     setSelectedPositionId(positionId);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedPositionId(null);
//   };

//   const handlePositionSelect = () => {
//     console.log('handlePositionSelect');
//     closeModal();
//   };

//   return (
//     <>
//       <div className={styles.add_controller}>
//         <Button
//           onClick={()=>openModal}
//           type="text"
//           style={{ height: 'auto' }}
//         >
//           <h1>자리 추가</h1>
//         </Button>
//       </div>

//       <PositionModal
//         open={isModalOpen}
//         onOk={handlePositionSelect}
//         onCancel={closeModal}
//         selectedMemberId={null}
//       />
//     </>
//   );
// }
