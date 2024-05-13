import LocalStorage from "./localStorage";

export const setItemWithExpireTime = (key: string, value: string, expire: number) => {
  const now = new Date();               // 현재 시간을 가져옵니다.
  const expireTime = new Date(now.getTime() + expire * 1000);
  const obj = {
    value: value,
    expire: new Date(expireTime),
  };

  const objString = JSON.stringify(obj);

  LocalStorage.setItem(key, objString);
};

export const getItemWithExpireTime = (key: string) => {
  const objString = LocalStorage.getItem(key);
  
  if (!objString) return null;

  const obj = JSON.parse(objString);

  if (Date.now() > new Date(obj.expire).getTime()) {
    LocalStorage.removeItem(key);
    return null;
  }
  return obj.value;
};
