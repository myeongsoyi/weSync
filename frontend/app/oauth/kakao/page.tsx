"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { setItemWithExpireTime } from "@/utils/controlStorage";
import Loading from "@/components/common/loading";
import { kakaoLoginAPI } from "@/services/kakaoLogin";
import LocalStorage from "@/utils/localStorage";
import { useEffect } from "react";

export default function KakaoOauth() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get("code") ?? "";
  // console.log('code',code);

  const doLogin = async () => {
    // const isLocal = process.env.NODE_ENV === "development";

    // const obj = isLocal
    //   ? {
    //       accessToken: process.env.NEXT_PUBLIC_ACCESSTOKEN,
    //       accessTokenExpireTime: "2024-03-27T01:47:02.000Z",
    //       refreshToken: process.env.NEXT_PUBLIC_REFRESHTOKEN,
    //       refreshTokenExpireTime: "2024-04-10T01:32:02.000Z",
    //       grantType: "Bearer",
    //       memberId: 6,
    //     }
    //   : await kakaoLoginAPI(code);

    const obj = await kakaoLoginAPI(code);

    if (obj) {
      setItemWithExpireTime("accessToken", obj.accessToken, obj.accessTokenExpireTime);
      setItemWithExpireTime("refreshToken", obj.refreshToken, obj.refreshTokenExpireTime);
      LocalStorage.setItem("grantType", obj.grantType);
      LocalStorage.setItem("memberId", obj.memberId);

      // if (obj.memberInfoCompleted && obj.kidInfoCompleted) {
      //   router.replace("/");
      // } else if (!obj.memberInfoCompleted) {
      //   LocalStorage.setItem("memberInfoCompleted", "false");
      //   router.replace("/join/profile");
      // } else if (!obj.kidInfoCompleted) {
      //   LocalStorage.setItem("kidInfoCompleted", "false");
      //   const isKid = confirm(
      //     "로그인 완료!\n아이 정보 입력이 완료되지않았습니다.\n입력하시겠습니까?"
      //   );
      //   if (isKid) {
      //     router.replace("/kid/name");
      //   } else {
      //     router.replace("/");
      //   }
      // }
    }
  };

  useEffect(() => {
    try {
      doLogin();
      router.replace("/");
    } catch (e) {
      console.log("error", e);
      router.replace("/error");
    }
  }, []);

  return <Loading />;
}
