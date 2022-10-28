import { ActionType, PageContainer, ProFormSwitch, ProList } from '@ant-design/pro-components';
import { Button, Progress, Tag } from 'antd';
import { useRef, useState } from 'react';

const data = [
  '语雀的天空',
  'Ant Design',
  '蚂蚁金服体验科技',
  'TechUI',
  'TechUI 2.0',
  'Bigfish',
  'Umi',
  'Ant Design Pro',
].map((item) => ({
  title: item,
  subTitle: <Tag color="#5BD8A6">语雀专栏</Tag>,
  actions: [<a key="run">编辑</a>, <a key="delete">删除</a>],
  avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
  content: (
    <div
      style={{
        flex: 1,
      }}
    >
      <div
        style={{
          width: 200,
        }}
      >
        <div>发布中</div>
        <Progress percent={80} />
      </div>
    </div>
  ),
}));

const Screen: React.FC = () => {
  const [ghost, setGhost] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  return (
    <PageContainer>
      <div
        style={{
          backgroundColor: '#eee',
          margin: -24,
          padding: 24,
        }}
      >
        <ProFormSwitch
          label="幽灵模式"
          fieldProps={{
            checked: ghost,
            onChange: (e) => setGhost(e),
          }}
        />
        <ProList<any>
          ghost={ghost}
          actionRef={actionRef}
          itemCardProps={{
            ghost,
          }}
          pagination={{
            defaultPageSize: 8,
            showSizeChanger: false,
          }}
          showActions="always"
          rowSelection={{}}
          grid={{ gutter: 16, column: 2 }}
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
          dataSource={data}
        />
      </div>
    </PageContainer>
  );
};

export default Screen;
