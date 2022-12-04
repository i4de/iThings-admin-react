import type { EditableFormInstance, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import {
  EditableProTable,
  ProCard,
  ProForm,
  ProFormDependency,
  ProFormField,
  ProFormRadio,
} from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useRef, useState } from 'react';

type DataSourceType = {
  key: React.Key;
  value?: string;
  result?: string;
};

const RequestHeaderTable: React.FC = () => {
  const formRef = useRef<ProFormInstance<any>>();
  const editorFormRef = useRef<EditableFormInstance<DataSourceType>>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);

  const defaultData: DataSourceType[] = [
    {
      key: '',
      value: '',
      result: '',
    },
  ];

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: 'key',
      dataIndex: 'key',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
      width: '40%',
    },
    {
      title: 'value',
      dataIndex: 'value',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record) => [
        <a
          key="delete"
          onClick={() => {
            const tableDataSource = formRef.current?.getFieldValue('table') as DataSourceType[];
            formRef.current?.setFieldsValue({
              table: tableDataSource.filter((item) => item.id !== record.id),
            });
          }}
        >
          删除
        </a>,
      ],
    },
    {
      title: '结果',
      dataIndex: 'result',
    },
  ];

  return (
    <ProForm<{
      table: DataSourceType[];
    }>
      formRef={formRef}
      initialValues={{
        table: defaultData,
      }}
      validateTrigger="onBlur"
    >
      <EditableProTable<DataSourceType>
        rowKey="key"
        scroll={{
          x: 960,
        }}
        editableFormRef={editorFormRef}
        maxLength={5}
        name="table"
        recordCreatorProps={{
          position: 'bottom',
          record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
        }}
        toolBarRender={() => [
          <ProFormRadio.Group
            key="render"
            fieldProps={{
              style: {
                marginBlockEnd: 0,
              },
            }}
          />,
          <Button
            type="text"
            key="rows"
            onClick={() => {
              const rows = editorFormRef.current?.getRowsData?.();
              console.log(rows);
            }}
          >
            获取 table 的数据
          </Button>,
        ]}
        columns={columns}
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys,
        }}
      />
      <ProForm.Item>
        <ProCard title="表格数据" headerBordered collapsible defaultCollapsed>
          <ProFormDependency name={['table']}>
            {({ table }) => {
              return (
                <ProFormField
                  ignoreFormItem
                  fieldProps={{
                    style: {
                      width: '100%',
                    },
                  }}
                  mode="read"
                  valueType="jsonCode"
                  text={JSON.stringify(table)}
                />
              );
            }}
          </ProFormDependency>
        </ProCard>
      </ProForm.Item>
    </ProForm>
  );
};
export default RequestHeaderTable;
