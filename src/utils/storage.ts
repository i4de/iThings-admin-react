/**
 * * 获取本地会话数据
 * @param k 键名
 * @returns any
 */
export const getLocalStorage = (k: string) => {
  const item = window.localStorage.getItem(k);
  try {
    return item ? JSON.parse(item) : item;
  } catch (err) {
    return item;
  }
};
