'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Next.js 13에서 변경된 라우터 가져오기
import Image from "next/image";


interface IParams {
  params: { teamId: string };
}


export default function TeamWorkspacePage({ params: { teamId } }: IParams) {
  const router = useRouter();

  useEffect(() => {
    if (router) {
      router.replace(`/team/${teamId}/information`);
    }
  }, []);

  return (
    <div className="py-10">
      {/* <h1>팀 ID : {teamId}</h1> */}
      <Image src={'/loading.gif'} alt="로딩" width={500} height={500} style={{margin: 'auto'}}></Image>
    </div>
  );
}
