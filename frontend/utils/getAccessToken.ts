// import { cookies } from "next/headers";
import { setItemWithExpireTime, getItemWithExpireTime } from "./controlStorage";
import LocalStorage from "./localStorage";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const isLogin = async () => {
  const accessToken = getItemWithExpireTime("accessToken");
  if (accessToken) {
    const grantType = LocalStorage.getItem("grantType");
    return `${grantType} ${accessToken}`;
  }

  const refreshToken = getItemWithExpireTime("refreshToken");
  if (refreshToken) {
    const grantType = LocalStorage.getItem("grantType");
    const res = await fetch(`${baseURL}/access-token/issue`, {
      method: "POST",
      headers: {
        Authorization: `${grantType} ${refreshToken}`,
      },
    });
    const obj = await res.json();
    if (res.status !== 200) {
      LocalStorage.removeItem("refreshToken");
      LocalStorage.removeItem("memberId");
      // LocalStorage.removeItem("memberInfoCompleted");
      return null;
    }
    setItemWithExpireTime("accessToken", obj.data.accessToken, obj.data.accessTokenExpireTime);
    const newAccessToken = getItemWithExpireTime("accessToken");
    return `${grantType} ${newAccessToken}`;
  }

  return null;
};

export async function getAccessToken() {
  // 클라이언트 전용 코드
  if (typeof window !== "undefined") {
    // const { setIsLogin } = useLoginStore();
    const token = await isLogin();
    // console.log("token", token)
    if (!token) {
      // setIsLogin(false);
      window.location.href = "/welcome";
    }
    return token;
  }
  // 서버에서는 토큰을 반환하지 않음
  return null;
}