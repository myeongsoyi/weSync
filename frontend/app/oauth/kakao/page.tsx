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

  const doLogin = async () => {
    
    const obj = await kakaoLoginAPI(code);
    
    if (obj) {
      setItemWithExpireTime("accessToken", obj.accessToken, obj.accessTokenExpireTime);
      setItemWithExpireTime("refreshToken", obj.refreshToken, obj.refreshTokenExpireTime);
      LocalStorage.setItem("grantType", obj.grantType);
      LocalStorage.setItem("memberId", obj.id);
      LocalStorage.setItem("profileImg", obj.img);
      LocalStorage.setItem("nickname", obj.nickname);
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
