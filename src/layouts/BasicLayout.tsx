import LowCodeLayout from '@/components/LowCodeLayout';
import RightContent from '@/components/RightContent';
import { OFFICIAL_WEBSITE } from '@/utils/const';
import type { MenuDataItem } from '@ant-design/pro-layout';
import { ProLayout } from '@ant-design/pro-layout';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import React from 'react';
// @ts-ignore
import { Link, useLocation, useModel } from 'umi';
import defaultSettings from '../../config/defaultSettings';
import logo from '../../public/icons/logo/Group.png';

moment.locale('zh-cn');

const BasicLayout: React.FC = (props) => {
  const location = useLocation();
  const menuDataFLag = location.pathname.includes('/visualizations/screen/detail');

  const { children } = props;
  const { initialState } = useModel('@@initialState');
  const menuTree = initialState?.currentUser?.menuInfo;

  return (
    <>
      {!menuDataFLag ? (
        <ProLayout
          location={{
            pathname: '../pages/Welcome.tsx',
          }}
          siderWidth={250}
          rightContentRender={() => <RightContent />}
          disableContentMargin={false}
          footerRender={false}
          menuItemRender={(menuItemProps: any, defaultDom: any) => {
            if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
              return (
                // @ts-ignore
                <Link to={menuItemProps.path ? menuItemProps.path : '#'}>{defaultDom}</Link>
              );
            }
            if (menuItemProps.pro_layout_parentKeys.length < 2) {
              // @ts-ignore
              return <Link to={menuItemProps.path}>{defaultDom}</Link>;
            } else {
              return (
                // @ts-ignore
                <Link to={menuItemProps.path}>
                  {menuItemProps.icon}
                  {defaultDom}
                </Link>
              );
            }
          }}
          subMenuItemRender={(TWTProps: any, defaultDom: any) => {
            return (
              <>
                <div>{defaultDom}</div>
              </>
            );
          }}
          menuDataRender={() => menuTree as MenuDataItem[]}
          {...props}
          {...defaultSettings}
          logo={<img src={logo} alt="" />}
          onMenuHeaderClick={() => {
            window.open(OFFICIAL_WEBSITE);
          }}
        >
          <div>
            <ConfigProvider locale={zhCN}>{children}</ConfigProvider>
          </div>
        </ProLayout>
      ) : (
        <LowCodeLayout />
      )}
    </>
  );
};

export default BasicLayout;
