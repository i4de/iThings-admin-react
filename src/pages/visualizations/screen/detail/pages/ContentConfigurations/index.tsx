import { Layout } from 'antd';
import ContentEdit from '../contentEdit';
import PageConfiguration from '../pageConfiguration';

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
      {/* 页面配置 */}
      <Sider
        collapsible
        width="350"
        collapsedWidth={20}
        reverseArrow
        style={{ backgroundColor: '#232324' }}
      >
        <PageConfiguration />
      </Sider>
    </Layout>
  );
};

export default ContentConfigurations;
