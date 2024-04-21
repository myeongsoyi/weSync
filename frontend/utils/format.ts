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
