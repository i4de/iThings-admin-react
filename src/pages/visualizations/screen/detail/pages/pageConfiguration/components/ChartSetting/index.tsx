import {
  NameSetting,
  PositionSetting,
  SizeSetting,
  StylesSetting,
} from '@/components/pages/ChartItemSetting';
import Arrange from '@/packages/components/Charts/Bars/BarCommon/Arrange';
import { Divider } from 'antd';
import React from 'react';

const ChartSetting: React.FC = () => {
  return (
    <div className="go-chart-configurations-setting">
      {/*名称*/}
      <NameSetting />
      {/*尺寸*/}
      <SizeSetting />
      {/*位置*/}
      <PositionSetting />
      {/*滤镜*/}
      <StylesSetting />
      <Divider style={{ margin: '0' }} />
      {/*自定义配置项*/}
      <Arrange />
    </div>
  );
};
export default ChartSetting;
