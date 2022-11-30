import {
  SendOutlined,
  SettingOutlined,
  SkinOutlined,
  ThunderboltOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { Tabs } from 'antd';
import { useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import CanvasPage from './components/CanvasPage';
import ChartAnimation from './components/ChartAnimation';
import ChartData from './components/ChartData';
import ChartEvent from './components/ChartEvent';
import ChartSetting from './components/ChartSetting';

import { useTargetData } from '@/pages/visualizations/screen/detail/pages/pageConfiguration/hooks/useTargetData';
import './styles.less';

export enum TabsEnum {
  PAGE_SETTING = 'pageSetting',
  CHART_SETTING = 'chartSetting',
  CHART_ANIMATION = 'chartAnimation',
  CHART_DATA = 'chartData',
  CHART_EVENT = 'chartEvent',
}

const PageConfiguration: React.FC = () => {
  // TODO: 异步懒加载组件处理样式问题
  // const CanvasPage = loadAsyncComponent(() => import('./components/CanvasPage'))
  // const ChartSetting = loadAsyncComponent(() => import('./components/ChartSetting'))
  // const ChartData = loadAsyncComponent(() => import('./components/ChartData'))
  // const ChartEvent = loadAsyncComponent(() => import('./components/ChartEvent'))
  // const ChartAnimation = loadAsyncComponent(() => import('./components/ChartAnimation'))

  const tabsSelect = useRef<TabsEnum>(TabsEnum.CHART_SETTING);

  const { selectTarget } = useTargetData(tabsSelect);

  //设置滚动条的样式
  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      width: '6px',
      backgroundColor: '#404043',
      borderRadius: '6px',
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} className="scroll-bar" />;
  };

  // 渲染tabItem项
  const renderTableItem = (item) => {
    return {
      label: (
        <div className="tabs-label n-text">
          {item?.icon}
          {item.title}
        </div>
      ),
      key: item?.key,
      children: item.children,
    };
  };

  // 页面设置
  const globalTabList = [
    {
      title: '页面配置',
      icon: <SettingOutlined />,
      key: TabsEnum.PAGE_SETTING,
      children: <CanvasPage />,
    },
  ];
  const globalTab = globalTabList.map(renderTableItem);

  const chartsDefaultTabList = [
    {
      key: TabsEnum.CHART_SETTING,
      title: '定制',
      icon: <ToolOutlined />,
      children: <ChartSetting />,
    },
    {
      key: TabsEnum.CHART_ANIMATION,
      title: '动画',
      icon: <SkinOutlined />,
      children: <ChartAnimation />,
    },
  ];
  const chartsDefaultTab = chartsDefaultTabList.map(renderTableItem);

  const chartsTabList = [
    ...chartsDefaultTabList,
    {
      key: TabsEnum.CHART_DATA,
      title: '数据',
      icon: <ThunderboltOutlined />,
      render: <ChartData />,
    },
    {
      key: TabsEnum.CHART_EVENT,
      title: '事件',
      icon: <SendOutlined />,
      render: <ChartEvent />,
    },
  ];

  const chartsTab = chartsTabList.map(renderTableItem);

  return (
    <div className="ithings-content-box  bg-depth2 ithings-content-layers ithings-boderbox">
      <div className={'content'}>
        <Scrollbars renderThumbVertical={renderThumb}>
          {!selectTarget ? (
            <>
              {/* 页面配置 */}
              <Tabs className="tabs-box" size="small" centered animated items={globalTab} />
            </>
          ) : (
            <>
              {/* 编辑 */}
              <Tabs
                className="tabs-box"
                size="small"
                centered
                animated
                defaultActiveKey={TabsEnum.CHART_SETTING}
                items={selectTarget.isGroup ? chartsDefaultTab : chartsTab}
              />
            </>
          )}
        </Scrollbars>
      </div>
    </div>
  );
};

export default PageConfiguration;
