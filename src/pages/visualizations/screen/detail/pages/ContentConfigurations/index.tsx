import { Layout } from 'antd';
import ContentEdit from '../contentEdit';

import './styles.less';

const { Content, Sider } = Layout;

const ContentConfigurations: React.FC<{ itemBoxOptions: any; allType: any }> = ({
  itemBoxOptions,
  allType,
}) => {
  return (
    <Layout hasSider className="content-edit-layout">
      <Content>
        {/* 图表拖拽区域 */}
        <ContentEdit itemBoxOptions={itemBoxOptions} allType={allType}></ContentEdit>
      </Content>
      <Sider collapsible width="300" collapsedWidth={20} reverseArrow></Sider>
    </Layout>
  );
};

export default ContentConfigurations;
