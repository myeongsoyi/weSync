// import { PointChangeType } from "@/types/point";
// import { ProductStatus } from "@/types/status";

// export function MoneyFormat(money: number) {
//   return money.toLocaleString() + "원";
// }

// export function KidBirthFormat(birthDate: string) {
//   const today = new Date();
//   const birth = new Date(birthDate);

//   const diff = today.getTime() - birth.getTime();
//   const dday = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
//   if (diff < 0) {
//     //아직 태어나지 않았을 때

//     return `0살 (D-${dday})`;
//   } else if (dday < 781) {
//     //25개월 이하일 때는 개월수로 표시

//     const month = Math.floor(dday / 30);
//     return `${month}개월 (D+${dday.toLocaleString()})`;
//   } else {
//     //만나이, 디데이 표시
//     let age = today.getFullYear() - birth.getFullYear();
//     let m = today.getMonth() - birth.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
//       age--;
//     }
//     return `만 ${age}살 (D+${dday.toLocaleString()})`;
//   }
// }

// export function ProductStatusFormat(status: ProductStatus) {
//   if (status === "PROGRESS") return "거래중";
//   else if (status === "SALE") return "판매중";
//   else return "판매종료";
// }

// export function PointChangeTypeFormat(type: PointChangeType) {
//   if (type === "CHARGE") return "충전";
//   else if (type === "PAY") return "구매";
//   else if (type === "PROFIT") return "판매";
//   else if (type === "REFUND") return "취소";
//   else return "출금";
// }

// export function calcElapsedMinutes(elapsedMinutes: number) {
//   if (elapsedMinutes >= 1440) return `${Math.floor(elapsedMinutes / 1440)}일 전`;
//   else if (elapsedMinutes >= 60) return `${Math.floor(elapsedMinutes / 60)}시간 전`;
//   else return `${elapsedMinutes}분 전`;
// }

export function DateStringFormat(dateString: string) {
  const date = new Date(dateString);
  
  // 날짜를 한국 시간대로 포맷합니다.
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone: 'Asia/Seoul'
  };
  
  // "YYYY. MM. DD." 형식으로 변환
  const formattedDate = new Intl.DateTimeFormat('ko-KR', options).format(date);
  
  // "YYYY. MM. DD." 형태로 출력되므로 이를 한국어 형식으로 바꿉니다.
  // 일부 브라우저에서는 . 뒤에 공백이 추가되므로 이를 제거합니다.
  const [year, month, day] = formattedDate.replace(/\s/g, '').split('.');

  return `${year}년 ${month}월 ${day}일`;
}



export function DateNoticeTimeFormat(dateString: string) {
  const date = new Date(dateString);
  
  // 한국 시간대의 날짜를 포맷합니다.
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone: 'Asia/Seoul'
  };
  const formattedDate = new Intl.DateTimeFormat('ko-KR', dateOptions).format(date);
  
  // 한국 시간대의 시간을 포맷합니다.
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Seoul'
  };
  const formattedTime = new Intl.DateTimeFormat('ko-KR', timeOptions).format(date);
  
  // "YYYY. M. D." 형태로 출력되므로 이를 한국어 형식으로 바꿉니다.
  const [year, month, day] = formattedDate.split('.').map(part => part.trim());
  
  return `${year}년 ${month}월 ${day}일 ${formattedTime}`;
}


