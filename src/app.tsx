import type { MenuDataItem, Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { message } from 'antd';
import { createLogger } from 'redux-logger';
import { history } from 'umi';
import { postSystemUserRead, postSystemUserResourceRead } from './services/iThingsapi/yonghuguanli';
import { IconMap } from './utils/iconMap';
import { getToken, getUID, spanTree } from './utils/utils';

const loginPath = '/user/login';

const loopMenuItem = (menus: any[]): MenuDataItem[] =>
  menus.map(({ icon, children, hideInMenu, ...item }) => {
    return {
      ...item,
      icon: (
        <img
          src={IconMap[icon as string]}
          alt=""
          style={{
            width: 14,
            height: 14,
            marginRight: 5,
            marginBottom: 5,
          }}
        />
      ),
      children: children && loopMenuItem(children),
      hideInMenu: hideInMenu === 1,
    };
  });

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: { userInfo: USER.UserInfoType; menuInfo: MenuDataItem[] };
  fetchUserInfo?: () => Promise<
    { userInfo: USER.UserInfoType; menuInfo: MenuDataItem[] } | undefined
  >;
}> {
  const fetchUserInfo = async () => {
    try {
      const token = getToken();
      const uid = getUID();

      if (!token || !uid) {
        return history.push(loginPath);
      }

      const body = { uid: uid };
      const msg = await postSystemUserRead(body);
      const menuTree = await postSystemUserResourceRead({});
      const menuInfo = loopMenuItem(
        spanTree(
          menuTree?.data?.menu?.sort((a, b) => (a.order as number) - (b.order as number)),
          1,
          'parentID',
        ),
      );
      return { userInfo: msg.data, menuInfo };
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

export const dva = {
  config: {
    onAction: createLogger(),
    onError(e: Error) {
      message.error(e.message, 3);
    },
  },
};
