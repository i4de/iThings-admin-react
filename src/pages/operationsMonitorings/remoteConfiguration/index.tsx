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
import { useEffect, useRef, useState } from 'react';
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
    // ??????????????????
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
      return message.error('json????????????');
    else if (editFlag)
      Modal.confirm({
        title: '???????????????????????????????????????????????????????????????????????????',
        width: 450,
        content: (
          <>
            <p className="remote-configuration-modal-text">
              ???????????????????????????????????????????????????????????????????????????????????????????????????topic
            </p>
            <p className="remote-configuration-modal-text">
              ??????????????? {selectOptions?.find((v) => v.value === productSelect)?.label}
            </p>
            <p className="remote-configuration-modal-text">???????????????????????????</p>
          </>
        ),
        closable: true,
        cancelText: '??????',
        okText: '????????????',
        onOk: confirmHandle,
      });
    else
      Modal.confirm({
        title:
          '????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????',
        width: 450,
        closable: true,
        cancelText: '??????',
        okText: '??????',
        onOk: () => updateJson(false),
      });
  };

  const columns: ProColumns<RemoteConfigurationItem>[] = [
    {
      title: '??????',
      dataIndex: 'id',
      search: false,
    },
    {
      title: '??????????????????',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
      renderText: (text: string) => timestampToDateStr(Number(text)),
    },
    {
      title: '??????',
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
          ??????
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
            label="??????"
            placeholder="???????????????"
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
            ????????????????????????????????????????????????JSON
            ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
            <a>??????</a>
          </section>
          <div className="editor">
            <header className="editor-header">
              <span className="header-tittle">????????????</span>
              <span className="header-content">
                ??????????????????{' '}
                <Tag color="orange">
                  {jsonSize / 1024 >= 1 ? (jsonSize / 1024).toFixed(2) : jsonSize}
                  {jsonSize / 1024 >= 1 ? 'kb' : 'b'}
                </Tag>{' '}
                (?????? 64KB)
              </span>
              <span className="header-submit-time">
                ????????????
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
            <Button onClick={editHandle}>{editFlag ? '??????' : '??????'}</Button>
            <Button
              className="remote-configuration-btn-update"
              type="primary"
              onClick={updateConfirm}
              disabled={jsonSize / 1024 >= 64}
            >
              {editFlag ? '??????' : '??????'}
            </Button>
          </div>
        </div>
        <ProTable<RemoteConfigurationItem>
          headerTitle={'??????????????????'}
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
          title="????????????"
          open={open}
          onOk={confirmHandle}
          confirmLoading={confirmLoading}
          onCancel={closeModal}
          footer={[
            <Button key="cancel" onClick={closeModal}>
              ??????
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={confirmLoading}
              onClick={() => updateJson(true)}
            >
              ??????????????????
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
