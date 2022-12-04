import { RequestContentTypeEnum } from '@/enums/httpEnum';
import { useTargetData } from '@/pages/visualizations/screen/detail/pages/pageConfiguration/hooks/useTargetData';
import { Button, Card, Modal, Space, Tag, Typography } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import RequestGlobalConfig from './components/RequestGlobalConfig';
import RequestTargetConfig from './components/RequestTargetConfig';

const { Text } = Typography;

const ChartDataRequest: React.FC<{
  modelShow: boolean;
  requestModelHandle: () => void;
  sendHandle: () => void;
}> = ({ modelShow, requestModelHandle, sendHandle }) => {
  const { selectTarget } = useTargetData();

  const requestContentTypeObj = {
    [RequestContentTypeEnum.DEFAULT]: '普通请求',
    [RequestContentTypeEnum.SQL]: 'SQL 请求',
  };

  const closeHandle = () => {
    requestModelHandle();
    sendHandle();
  };
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
    <Modal open={modelShow} className="ithings-chart-data-request">
      <Card
        actions={[
          <div>
            <Text>「 {selectTarget?.chartConfig.categoryName} 」</Text>
            <Text>—— </Text>
            <Tag color="#e8f2fd" style={{ borderRadius: '5px' }}>
              {requestContentTypeObj[selectTarget?.request]}
            </Tag>
          </div>,
          <Button type="primary" onClick={closeHandle}>
            保存 & 发送请求
          </Button>,
        ]}
      >
        <Scrollbars renderThumbVertical={renderThumb}>
          <div className="ithings-pr-3">
            <Space direction="vertical">
              <RequestGlobalConfig />
              <RequestTargetConfig />
            </Space>
          </div>
        </Scrollbars>
      </Card>
    </Modal>
  );
};
export default ChartDataRequest;
