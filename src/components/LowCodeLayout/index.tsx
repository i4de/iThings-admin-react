import ScreenDetail from '@/pages/visualizations/screen/detail';
import { ConfigProvider, Layout } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import React from 'react';

const LowCodeLayout: React.FC = () => {
  return (
    <>
      <ConfigProvider locale={zhCN}>
        <Layout style={{ overflow: 'hidden' }}>
          <ScreenDetail />
        </Layout>
      </ConfigProvider>
    </>
  );
};
export default LowCodeLayout;
