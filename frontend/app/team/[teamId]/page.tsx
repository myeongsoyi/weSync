'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Next.js 13에서 변경된 라우터 가져오기


interface IParams {
  params: { teamId: string };
}


export default function TeamPage({ params: { teamId } }: IParams) {
  const router = useRouter();

  useEffect(() => {
    if (router) {
      router.replace(`/team/${teamId}/information`);
    }
  }, []);

  return (
    <>
      <h1>팀 ID : {teamId}</h1>
      <h2>Loading...</h2>
    </>
  );
}
