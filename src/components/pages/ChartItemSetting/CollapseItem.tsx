import { Collapse, Divider } from 'antd';
import type { ReactNode } from 'react';

const { Panel } = Collapse;

const CollapseItem: React.FC<{
  name: string;
  extraNode?: () => ReactNode;
  expanded?: boolean;
}> = (props) => {
  const { name, extraNode, expanded } = props || {};
  const collapseHandle = () => {};

  return (
    <>
      <Divider style={{ margin: '16px 0 0 0' }} />
      <Collapse onChange={collapseHandle} accordion defaultActiveKey={expanded ? name : ''}>
        <Panel header={name} key={name} extra={extraNode?.()} collapsible="header">
          {props.children}
        </Panel>
      </Collapse>
    </>
  );
};

export default CollapseItem;
