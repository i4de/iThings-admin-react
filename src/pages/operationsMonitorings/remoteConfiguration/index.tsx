import Editor from '@/components/MonacoEditor';
import useGetDataContent from '@/hooks/useGetDataContent';
import useGetSelectOptions from '@/hooks/useGetSelectOption';
import useGetTableList from '@/hooks/useGetTableList';
import useTableCreate from '@/hooks/useTableCreate';
import useTableUpdate from '@/hooks/useTableUpdate';
import { postThingsProductInfoIndex } from '@/services/iThingsapi/chanpinguanli';
import {
  postThingsProductRemoteConfigCreate,
  postThingsProductRemoteConfigIndex,
  postThingsProductRemoteConfigLastestRead,
  postThingsProductRemoteConfigPushAll,
} from '@/services/iThingsapi/chanpinyuanchengpeizhi';
import { ResponseCode } from '@/utils/base';
import { PROTABLE_OPTIONS } from '@/utils/const';
import { timestampToDateStr } from '@/utils/date';
import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { ProFormSelect } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal, Skeleton, Tag } from 'antd';
import debounce from 'lodash/debounce';
import type { editor } from 'monaco-editor';
import sizeof from 'object-sizeof';
import React, { useEffect, useRef, useState } from 'react';
import type { ChangeHandler, MonacoEditorProps } from 'react-monaco-editor';
import '../../systemMangers/menu/styles.less';
import './styles.less';
import type { RemoteConfigurationItem } from './types';

const RemoteConfiguration = () => {
  const { queryPage } = useGetTableList();
  const { queryData, dataContent } = useGetDataContent<RemoteConfigurationItem>();
  const { querySelectOptions, selectOptions } = useGetSelectOptions();
  const { createHandler } = useTableCreate();
  const { updateHandler } = useTableUpdate();

  const [productSelect, setProductSelect] = useState('');
  const [monacoData, setMonacoData] = useState('');
  const [viewMonacoData, setViewMonacoData] = useState('');
  const [jsonSize, setJsonSize] = useState(0);
  const [editFlag, setEditFlag] = useState(true);
  const [editError, setEditError] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const actionRef = useRef<ActionType>();
  const monacoRef = useRef<MonacoEditorProps>();
  const editorRef = useRef<editor.IStandaloneCodeEditor>();

  type QueryProductProp = typeof postThingsProductInfoIndex;
  type QueryDataProp = typeof postThingsProductRemoteConfigLastestRead;
  type QueryProp = typeof postThingsProductRemoteConfigIndex;

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const onChangeError = debounce((value) => {
    const error = monacoRef?.current?.editor.getModelMarkers(value);
    if (error.length) setEditError(true);
    else setEditError(false);
  }, 600);

  const editorChange: ChangeHandler = (value) => {
    onChangeError(value);
    setEditError(false);
    setMonacoData(value);
    setJsonSize(sizeof(value));
  };

  const editHandle = () => setEditFlag(!editFlag);

  const confirmHandle = () => {
    // 批量更新逻辑
    updateHandler(postThingsProductRemoteConfigPushAll, undefined, {
      productID: productSelect,
    });
  };

  const updateTableList = () => actionRef?.current?.reload();

  const updateJson = (updateMonacoData: boolean) => {
    setConfirmLoading(true);
    if (!editFlag || updateMonacoData)
      createHandler(
        postThingsProductRemoteConfigCreate,
        undefined,
        {
          productID: productSelect,
          content: updateMonacoData ? viewMonacoData : monacoData,
        },
        updateTableList,
      ).then((res) => {
        if (res?.code === ResponseCode.SUCCESS) {
          setEditFlag(true);
          setConfirmLoading(false);
          closeModal();
          if (updateMonacoData) setMonacoData(viewMonacoData);
        }
      });
  };

  const updateConfirm = () => {
    if ((!editFlag && editError) || (!editFlag && !monacoData))
      return message.error('json格式错误');
    else if (editFlag)
      Modal.confirm({
        title: '是否确认对该产品下的所有设备进行批量远程配置更新？',
        width: 450,
        content: (
          <>
            <p className="remote-configuration-modal-text">
              注：该产品下的所有设备将自动更新该配置文件，设备端需订阅远程配置的topic
            </p>
            <p className="remote-configuration-modal-text">
              指定产品： {selectOptions?.find((v) => v.value === productSelect)?.label}
            </p>
            <p className="remote-configuration-modal-text">设备范围：所有设备</p>
          </>
        ),
        closable: true,
        cancelText: '取消',
        okText: '确认更新',
        onOk: confirmHandle,
      });
    else
      Modal.confirm({
        title:
          '是否保存当前配置信息？保存后可以手动将配置批量更新到该产品下的所有设备，设备也可以主动获取配置。',
        width: 450,
        closable: true,
        cancelText: '取消',
        okText: '确认',
        onOk: () => updateJson(false),
      });
  };

  const columns: ProColumns<RemoteConfigurationItem>[] = [
    {
      title: '编号',
      dataIndex: 'id',
      search: false,
    },
    {
      title: '版本更新时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
      renderText: (text: string) => timestampToDateStr(Number(text)),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            openModal();
            setViewMonacoData(record?.content);
          }}
        >
          查看
        </Button>
      ),
    },
  ];

  useEffect(() => {
    setProductSelect(selectOptions[0]?.value);
    querySelectOptions<QueryProductProp>(postThingsProductInfoIndex, {
      page: { page: 1, size: 99999 },
      label: 'productName',
      value: 'productID',
    });
  }, [selectOptions.length]);

  useEffect(() => {
    if (productSelect?.length) {
      queryData<QueryDataProp, { productID: string }>(postThingsProductRemoteConfigLastestRead, {
        productID: productSelect,
      });
    }
  }, [productSelect]);

  useEffect(() => {
    const json = dataContent?.content as string;
    setJsonSize(sizeof(json));
    setMonacoData(json);
  }, [dataContent, productSelect]);

  return (
    <PageContainer>
      <Skeleton loading={!dataContent} active>
        <div style={{ backgroundColor: 'white', padding: '24px' }}>
          <ProFormSelect
            name="productID"
            width={150}
            label="产品"
            placeholder="请选择产品"
            showSearch
            options={selectOptions}
            fieldProps={{
              value: productSelect,
              onChange: (v: string) => {
                setProductSelect(v);
                actionRef?.current?.reload();
                setEditFlag(true);
              },
            }}
          />
          <section className="menu-tool-tip">
            <ExclamationCircleTwoTone className="menu-icon" twoToneColor="#ed6a0c" />
            平台支持远程更新设备的配置文件（JSON
            格式），您可以在下方编辑配置模板，对设备的系统参数、网络参数等进行远程配置，通过批量更新对设备进行批量远程维护和管理，详细说明请参见
            <a>文档</a>
          </section>
          <div className="editor">
            <header className="editor-header">
              <span className="header-tittle">配置模版</span>
              <span className="header-content">
                当前文件大小{' '}
                <Tag color="orange">
                  {jsonSize / 1024 >= 1 ? (jsonSize / 1024).toFixed(2) : jsonSize}
                  {jsonSize / 1024 >= 1 ? 'kb' : 'b'}
                </Tag>{' '}
                (上限 64KB)
              </span>
              <span className="header-submit-time">
                提交于：
                {timestampToDateStr(Number(dataContent?.createTime))}
              </span>
            </header>
            <Editor
              height={'35vh'}
              value={monacoData}
              onChange={editorChange}
              language={'json'}
              monacoRef={monacoRef as React.MutableRefObject<MonacoEditorProps>}
              editorRef={editorRef as React.MutableRefObject<editor.IStandaloneCodeEditor>}
              readOnly={editFlag ? true : false}
            />
          </div>
          <div className="remote-configuration-btn">
            <Button onClick={editHandle}>{editFlag ? '编辑' : '取消'}</Button>
            <Button
              className="remote-configuration-btn-update"
              type="primary"
              onClick={updateConfirm}
              disabled={jsonSize / 1024 >= 64}
            >
              {editFlag ? '下发' : '保存'}
            </Button>
          </div>
        </div>
        <ProTable<RemoteConfigurationItem>
          headerTitle={'配置版本记录'}
          actionRef={actionRef}
          rowKey="id"
          options={{ ...PROTABLE_OPTIONS }}
          search={false}
          request={(params) =>
            queryPage<QueryProp, RemoteConfigurationItem>(postThingsProductRemoteConfigIndex, {
              ...params,
              productID: productSelect,
            })
          }
          columns={columns}
          pagination={{ pageSize: 10 }}
          size={'middle'}
        />
        <Modal
          title="查看详情"
          open={open}
          onOk={confirmHandle}
          confirmLoading={confirmLoading}
          onCancel={closeModal}
          footer={[
            <Button key="cancel" onClick={closeModal}>
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={confirmLoading}
              onClick={() => updateJson(true)}
            >
              恢复至此版本
            </Button>,
          ]}
        >
          <Editor
            height={'35vh'}
            value={viewMonacoData}
            onChange={editorChange}
            language={'json'}
            monacoRef={monacoRef as React.MutableRefObject<MonacoEditorProps>}
            editorRef={editorRef as React.MutableRefObject<editor.IStandaloneCodeEditor>}
            readOnly={true}
          />
        </Modal>
      </Skeleton>
    </PageContainer>
  );
};

export default RemoteConfiguration;
