'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Next.js 13에서 변경된 라우터 가져오기


interface IParams {
  params: { teamId: string };
}


export default function TeamPage({ params: { teamId } }: IParams) {
  const router = useRouter();

  useEffect(() => {
    // 라우터가 준비되었는지 확인
    console.log('Redirecting...');
    if (router) {
      router.replace(`/team/${teamId}/information`);
    }
  }, []);

  return (
    <>
      <h1>팀 ID : {teamId}</h1>
    </>
  );
}
