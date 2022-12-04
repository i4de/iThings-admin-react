import { RequestParamsTypeEnum } from '@/enums/httpEnum';
import { Tabs } from 'antd';
import RequestHeaderTable from '../RequestHeaderTable';

const RequestGlobalHeaderTable: React.FC = () => {
  // 渲染tabItem项
  const renderTableItem = (item) => {
    return {
      label: <div className="tabs-label n-text">{item.title}</div>,
      key: item?.key,
      children: item.children,
    };
  };
  const requestGlobalHeaderTabList = [
    {
      key: RequestParamsTypeEnum.HEADER,
      title: 'Header',
      children: <RequestHeaderTable />,
    },
  ];
  const requestGlobalHeaderTab = requestGlobalHeaderTabList.map(renderTableItem);
  return (
    <div>
      <Tabs size="small" centered animated items={requestGlobalHeaderTab} />
    </div>
  );
};
export default RequestGlobalHeaderTable;
