import { Collapse, Divider } from 'antd';
import { ReactNode } from 'react';

const { Panel } = Collapse;

const CollapseItem: React.FC<{
  name: string;
  extraNode: () => ReactNode;
}> = (props) => {
  const { name, extraNode } = props;
  const collapseHandle = () => {};

  return (
    <>
      <Divider style={{ margin: '10px 0' }} />
      <Collapse onChange={collapseHandle} accordion>
        <Panel header={name} key={name} extra={extraNode()} collapsible="header">
          {props.children}
        </Panel>
      </Collapse>
    </>
  );
};

export default CollapseItem;
