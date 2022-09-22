import useGetTableList from '@/hooks/useGetTableList';
import useTableDelete from '@/hooks/useTableDelete';
import {
  postSystemUserIndex,
  postSystemUser__openAPI__delete,
} from '@/services/iThingsapi/yonghuguanli';
import { ResponseCode } from '@/utils/base';
import { PROTABLE_OPTIONS, ROLE_VALUE_ENUM, SEARCH_CONFIGURE } from '@/utils/const';
import { timestampToDateStr } from '@/utils/date';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Divider, message } from 'antd';
import React, { useRef } from 'react';
import CreateOrUpdateUser from './components/CreateOrUpdateUser';
import type { UserListItem } from './types';
const UserList: React.FC = () => {
  const { queryPage } = useGetTableList();
  const { deleteHandler } = useTableDelete();
  const actionRef = useRef<ActionType>();
  type QueryProp = typeof postSystemUserIndex;

  // 删除操作
  const showDeleteConfirm = (record: { uid: string; userName: string }) => {
    const body = {
      uid: record?.uid ?? '',
    };
    deleteHandler(
      {
        title: '是否删除当前用户',
        content: `所选用户: ${record?.userName ?? '未知用户'},  删除后无法恢复，请确认`,
      },
      async () => {
        let res;
        try {
          res = await postSystemUser__openAPI__delete(body);
          if (res.code === ResponseCode.SUCCESS) {
            actionRef.current?.reload();
            message.success('删除成功');
          }
        } catch (error) {
          message.error((error as Error)?.message);
        }
        return res;
      },
      () => {
        console.log('Cancel');
      },
    );
  };

  const columns: ProColumns<UserListItem>[] = [
    {
      title: '编号',
      dataIndex: 'uid',
      search: false,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      search: false,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      search: false,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      valueType: 'dateTime',
      search: false,
      renderText: (text: string) => timestampToDateStr(Number(text)),
    },
    {
      title: '注册IP',
      dataIndex: 'regIP',
      search: false,
    },
    {
      title: '最后登录IP',
      dataIndex: 'lastIP',
      search: false,
    },
    {
      title: '角色',
      dataIndex: 'role',
      search: false,
      valueEnum: ROLE_VALUE_ENUM,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <CreateOrUpdateUser flag="update" record={record} actionRef={actionRef} />
          <Divider type="vertical" />
          <Button type="primary" danger onClick={() => showDeleteConfirm(record)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<UserListItem>
        headerTitle="用户管理"
        actionRef={actionRef}
        rowKey="uid"
        search={SEARCH_CONFIGURE}
        options={PROTABLE_OPTIONS}
        toolBarRender={() => [
          <CreateOrUpdateUser flag="create" actionRef={actionRef} key="createUser" />,
        ]}
        request={(params) => queryPage<QueryProp, UserListItem>(postSystemUserIndex, { ...params })}
        columns={columns}
        pagination={{ pageSize: 10 }}
        size={'middle'}
      />
    </PageContainer>
  );
};

export default UserList;
