import { PROTABLE_OPTIONS, SEARCH_CONFIGURE } from '@/utils/const';
import { timestampToDateStr } from '@/utils/date';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Modal, Space, Tag } from 'antd';
import React, { useRef, useState } from 'react';
//import type { MenuListItem } from './types';

const OperationLogList: React.FC = () => {
  // const { queryPage } = useGetTableList();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const actionRef = useRef<ActionType>();
  // type QueryProp = typeof postSystemMenuIndex;

  //mock
  const operationLogList = [
    {
      id: '1',
      systemModule: '用户管理',
      type: [
        {
          name: '新增',
          color: 'blue',
        },
      ],
      requestMethod: 'post',
      operator: 'xxx',
      ip: '192.168.0.1',
      status: '1',
      operationTime: '182736176313',
    },
  ];

  const onOpen = () => {
    setIsModalOpen(true);
  };
  const onClose = () => {
    setIsModalOpen(false);
  };

  const columns: ProColumns<MenuListItem>[] = [
    {
      title: '编号',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '系统模块',
      dataIndex: 'systemModule',
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      valueType: 'select',
      hideInTable: true,
      valueEnum: {
        1: { text: '新增' },
        2: { text: '删除' },
        3: { text: '修改' },
        4: { text: '查询' },
      },
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      valueType: 'select',
      hideInSearch: true,
      render: (_, record) => (
        <Space>
          {record.type.map(({ name, color }) => (
            <Tag color={color} key={name}>
              {name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '请求方式',
      dataIndex: 'requestMethod',
      hideInSearch: true,
    },
    {
      title: '操作人员',
      dataIndex: 'operator',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: '操作地址',
      dataIndex: 'ip',
      hideInSearch: true,
    },
    {
      title: '操作状态',
      dataIndex: 'status',
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: {
        1: { text: '成功', status: 'Success' },
        2: { text: '失败', status: 'Error' },
      },
    },

    {
      title: '操作时间',
      dataIndex: 'operationTime',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
      renderText: (text: string) => timestampToDateStr(Number(text)),
    },
    {
      title: '操作时间',
      dataIndex: 'operationTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: () => (
        <Button type="primary" onClick={onOpen}>
          查看
        </Button>
      ),
    },
  ];

  const queryPageHandler = async () =>
    // params: ParamsType & {
    //   pageSize?: number | undefined;
    //   current?: number | undefined;
    //   keyword?: string | undefined;
    // },
    {
      return Promise.resolve({
        data: operationLogList,
        success: true,
      });
    };

  return (
    // TODO: 菜单目前只支持单条搜索结果
    <PageContainer>
      <ProTable<MenuListItem>
        headerTitle="操作日志"
        actionRef={actionRef}
        rowKey="id"
        search={SEARCH_CONFIGURE}
        options={PROTABLE_OPTIONS}
        request={(params) => queryPageHandler(params)}
        columns={columns}
        pagination={false}
        size={'middle'}
      />
      <Modal title="操作日志详情" visible={isModalOpen} onOk={onOpen} onCancel={onClose}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </PageContainer>
  );
};

export default OperationLogList;
