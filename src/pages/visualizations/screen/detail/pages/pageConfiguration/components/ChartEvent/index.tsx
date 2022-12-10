import { useTargetData } from '@/pages/visualizations/screen/detail/pages/pageConfiguration/hooks/useTargetData';
import { Collapse, Divider, Typography } from 'antd';
import React from 'react';
import ChartEventAdvancedHandle from './components/ChartEventAdvancedHandle';
import ChartEventBaseHandle from './components/ChartEventBaseHandle';

const { Text } = Typography;

const ChartEvent: React.FC = () => {
  const { selectTarget } = useTargetData();

  return (
    <>
      <Text className="text">
        组件id：
        <Text className="text">{selectTarget?.id}</Text>
      </Text>
      <Divider />
      {/*事件配置*/}
      <Collapse className="ithings-mt-3" defaultActiveKey={['1', '2']}>
        <ChartEventBaseHandle />

        <ChartEventAdvancedHandle />
      </Collapse>
    </>
  );
};
export default ChartEvent;
