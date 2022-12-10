import ScrollBar from '@/components/ScrollBar';
import { Collapse, Typography } from 'antd';
import React from 'react';

const { Panel } = Collapse;
const { Text } = Typography;

const ValidationResult: React.FC<{ validEvents: () => Record<string, string>[] }> = ({
  validEvents,
}) => {
  return (
    <ScrollBar height={'500px'}>
      <Collapse className="ithings-px-3" defaultActiveKey={['1', '2', '3']}>
        {validEvents().map((item) => (
          <Panel key={item.key} header={item.title}>
            <Text className="text-typography">{item?.msg || '暂无'}</Text>
          </Panel>
        ))}
      </Collapse>
    </ScrollBar>
  );
};

export default ValidationResult;
