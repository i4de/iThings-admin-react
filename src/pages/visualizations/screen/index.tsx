import screenSrc from '@/assets/screenItem/moke-20211219181327.png';
import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  FormOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { ActionType, PageContainer, ProList } from '@ant-design/pro-components';
import { Button, Dropdown, Image, Menu, MenuProps, message, Tag, Tooltip } from 'antd';
import { useRef } from 'react';
const Screen: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const onClick: MenuProps['onClick'] = ({ key }) => {
    message.info(`Click on item ${key}`);
  };

  const menu = (
    <Menu
      onClick={onClick}
      items={[
        {
          label: '预览',
          key: '1',
          icon: <EyeOutlined />,
        },
        {
          label: '复制',
          key: '2',
          icon: <CopyOutlined />,
        },
        {
          label: '重命名',
          key: '3',
          icon: <FormOutlined />,
        },
        {
          type: 'divider',
        },
        {
          label: '发布',
          key: '4',
          icon: <SendOutlined />,
        },
        {
          label: '下载',
          key: '5',
          icon: <DownloadOutlined />,
        },
        {
          type: 'divider',
        },
        {
          label: '删除',
          key: '6',
          icon: <DeleteOutlined />,
        },
      ]}
    />
  );

  const screenList = [
    {
      id: 1,
      title: '物料1-假数据不可用',
      release: true,
      label: '官方案例',
    },
    {
      id: 2,
      title: '物料2-假数据不可用',
      release: false,
      label: '官方案例',
    },
    {
      id: 3,
      title: '物料3-假数据不可用',
      release: false,
      label: '官方案例',
    },
    {
      id: 4,
      title: '物料4-假数据不可用',
      release: false,
      label: '官方案例',
    },
    {
      id: 5,
      title: '物料5-假数据不可用',
      release: false,
      label: '官方案例',
    },
  ].map((item) => ({
    id: item.id,
    title: item.title,
    subTitle: (
      <Tag color={item.release ? '#34c749' : '#fcbc40'}>{item.release ? '已发布' : '未发布'}</Tag>
    ),
    actions: [
      <Tooltip title="编辑" key="edit">
        <EditOutlined />
      </Tooltip>,
      <Dropdown overlay={menu} key="dropdown">
        <EllipsisOutlined />
      </Dropdown>,
    ],
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
    content: <Image src={screenSrc} height={180} alt={item.title} />,
  }));
  return (
    <PageContainer>
      <div
        style={{
          backgroundColor: '#eee',
          margin: -24,
          padding: 24,
        }}
      >
        <ProList<any>
          actionRef={actionRef}
          pagination={{
            defaultPageSize: 8,
            showSizeChanger: false,
          }}
          showActions="always"
          rowSelection={{}}
          grid={{ gutter: 16, column: 4 }}
          onItem={(record: any) => {
            return {
              onMouseEnter: () => {
                console.log(record);
              },
              onClick: () => {
                console.log(record);
              },
            };
          }}
          metas={{
            title: {},
            subTitle: {},
            type: {},
            avatar: {},
            content: {},
            actions: {
              cardActionProps: 'extra',
            },
          }}
          toolBarRender={() => [<Button>创建大屏</Button>]}
          headerTitle="大屏管理"
          dataSource={screenList}
        />
      </div>
    </PageContainer>
  );
};

export default Screen;
