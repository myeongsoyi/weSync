export const kakaoLoginAPI = async (code: string) => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  // const appURL = process.env.NEXT_PUBLIC_APP_URL;

  try {
    const res = await fetch(`${baseURL}/users?code=${code}`);
    const obj = await res.json();
    if (obj.success) {
      return obj.data;
    } else {
      //TODO: error 페이지로 이동
      throw new Error(obj.error.errorMessage);
    }
  } catch (e: any) {
    //TODO: error 페이지로 이동
  }
};
