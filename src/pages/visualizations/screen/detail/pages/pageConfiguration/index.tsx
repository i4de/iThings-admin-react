import { AppleOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { useSelector } from 'umi';
import CanvasPage from './components/CanvasPage';

import './styles.less';

const PageConfiguration: React.FC = () => {
  const { targetChart } = useSelector((state) => state.chartEditStore);

  enum TabsEnum {
    PAGE_SETTING = 'pageSetting',
    CHART_SETTING = 'chartSetting',
    CHART_ANIMATION = 'chartAnimation',
    CHART_DATA = 'chartData',
  }

  //设置滚动条的样式
  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      width: '6px',
      backgroundColor: '#404043',
      borderRadius: '6px',
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} className="scroll-bar" />;
  };

  return (
    <div className="ithings-content-box  bg-depth2 ithings-content-layers ithings-boderbox">
      <div className={'content'}>
        <Scrollbars renderThumbVertical={renderThumb}>
          {!targetChart.selectId.length ? (
            <>
              {/* 页面配置 */}
              <Tabs
                className="tabs-box"
                // type="card"
                size="small"
                centered
                animated
                defaultActiveKey="1"
                items={[AppleOutlined].map((Icon) => {
                  return {
                    label: (
                      <div className="tabs-label n-text">
                        <Icon />
                        页面配置
                      </div>
                    ),
                    key: TabsEnum.PAGE_SETTING,
                    children: <CanvasPage />,
                  };
                })}
              />
            </>
          ) : (
            <>
              {/* 编辑 */}
              <Tabs />
            </>
          )}
        </Scrollbars>
      </div>
    </div>
  );
};

export default PageConfiguration;
