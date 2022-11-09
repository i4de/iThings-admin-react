import ScreenDetail from '@/pages/visualizations/screen/detail';
import { ConfigProvider, Layout } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const LowCodeLayout: React.FC = () => {
  return (
    <>
      <ConfigProvider locale={zhCN}>
        <DndProvider backend={HTML5Backend}>
          <Layout style={{ overflow: 'hidden' }}>
            <ScreenDetail />
          </Layout>
        </DndProvider>
      </ConfigProvider>
    </>
  );
};
export default LowCodeLayout;
