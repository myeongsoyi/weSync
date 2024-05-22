'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTeamInviteAccept } from '@/services/team';

export default function InviteComponent({ code }: { code: string }) {
  const [success, setSuccess] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const router = useRouter();
  useEffect(() => {
    const fetchTeamInviteAccept = async () => {
      const res = await getTeamInviteAccept(code);
      if (res.success) {
        setSuccess(res.success);
        router.push(`/team/${res.data.teamId}/information`);
      } else {
        setSuccess(res.success);
        setErrorMsg(res.error.errorMessage);
      }
    };
    fetchTeamInviteAccept();
  }, []);

  return (
    <div className="loading flex-col justify-center items-center">
      {success ? (
        <div>
          <Image
            src={
              'https://we-sync.s3.ap-southeast-2.amazonaws.com/front/Loading.gif'
            }
            alt="로딩"
            width={450}
            height={450}
            style={{ margin: 'auto' }}
            unoptimized
            priority
          ></Image>
          <h2 className="text-center mt-10">잠시만</h2>
          <h2 className="text-center">기다려주세요</h2>
        </div>
      ) : (
        <div>
          <Image
            src={
              'https://we-sync.s3.ap-southeast-2.amazonaws.com/front/3d-render-of-red-paper-clipboard-with-cross-mark.png'
            }
            alt="로딩"
            width={500}
            height={500}
            style={{ margin: 'auto' }}
            unoptimized
            priority
          ></Image>
          <h2 className="text-center mt-10">요청이 실패했습니다.</h2>
          <h2 className="text-center">
            {errorMsg ?? '잠시 후 다시 시도해주세요.'}
          </h2>
        </div>
      )}
    </div>
  );
}
