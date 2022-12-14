import { timestampToDateStr } from '@/utils/date';
import { isOnlineEnum } from '@/utils/utils';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { ProColumns } from '@ant-design/pro-table';
import type { DeviceInfo } from '../../data';
import styles from '../../index.less';

interface InfoProps {
  deviceInfo: DeviceInfo;
}

const BasicInfoPage: React.FC<InfoProps> = (props) => {
  const { deviceInfo } = props;

  const columns: ProColumns<DeviceInfo>[] = [
    {
      title: '设备名称',
      key: 'deviceName',
      dataIndex: 'deviceName',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '产品ID',
      key: 'productID',
      dataIndex: 'productID',
      copyable: true,
    },
    {
      title: '设备密钥',
      key: 'secret',
      dataIndex: 'secret',
      copyable: true,
    },
    {
      title: '设备创建时间',
      key: 'createdTime',
      dataIndex: 'createdTime',
      renderText: (text: string) => timestampToDateStr(Number(text)),
    },
    {
      title: '最后上线时间',
      key: 'lastLogin',
      dataIndex: 'lastLogin',
      renderText: (text: string) => timestampToDateStr(Number(text)),
    },
    {
      title: '激活时间',
      key: 'firstLogin',
      dataIndex: 'firstLogin',
      renderText: (text: string) => timestampToDateStr(Number(text)),
    },
    {
      title: '设备状态',
      key: 'isOnline',
      dataIndex: 'isOnline',
      valueType: 'select',
      valueEnum: isOnlineEnum(deviceInfo),
    },
    {
      title: '固件版本',
      key: 'version',
      dataIndex: 'version',
    },
  ];
  return (
    <ProDescriptions
      className={styles.descriptions}
      title="设备信息"
      dataSource={deviceInfo}
      colon={false}
      columns={columns}
    />
  );
};

export default BasicInfoPage;
