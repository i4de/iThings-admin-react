/* eslint-disable @typescript-eslint/no-shadow */
import {
  postThingsProductSchemaIndex,
  postThingsProductSchemaTslImport,
  postThingsProductSchemaTslRead,
  postThingsProductSchema__openAPI__delete
} from '@/services/iThingsapi/wumoxing';
import { downloadFunction, isJSON } from '@/utils/utils';
import { CopyOutlined, DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Alert, Button, Input, message, Modal } from 'antd';
import { useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { useParams } from 'umi';
import { DATA_TYPE_ENUM, MODE_ENUM, TYPE_ENUM } from './components/const';
import { EditForm } from './components/editForm';
import styles from './style.less';

type ProductSchemaInfo = {
  productID: string;
  type: number;
  tag?: number;
  identifier: string;
  name?: string;
  desc?: string;
  required: number;
  affordance: string;
};

type queryParam = {
  pageSize: number;
  current: number;
  productID?: string;
};

export default () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [exportJSON, setExportJSON] = useState();
  const [tsl, setTsl] = useState('');
  const [jsonError, setJsonError] = useState(false);
  const urlParams = useParams() as { id: string };
  const productID = urlParams.id ?? '';
  const actionRef = useRef<ActionType>();
  const modelModalRef = useRef({
    clearModal: Function,
    createModel: Function,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setModelModalValue: (_: any, __: any) => { },
  });

  const boolRender = (record: ProductSchemaInfo) => {
    const mapping = JSON.parse(record?.affordance)?.define?.mapping;
    const array = Object.entries(mapping);
    return (
      <div>
        {array.map((item) => {
          return (
            <p key={item[0]}>
              {item[0]} - {item[1]}
            </p>
          );
        })}
      </div>
    );
  };

  const intRender = (record: ProductSchemaInfo) => {
    const { min, max, start, step, unit } = JSON.parse(record?.affordance)?.define;
    return (
      <div>
        <p>
          ????????????: {min} - {max}
        </p>
        <p>?????????: {start}</p>
        <p>??????: {step}</p>
        <p>??????: {unit}</p>
      </div>
    );
  };

  const stringRender = (record: ProductSchemaInfo) => {
    const { max } = JSON.parse(record?.affordance)?.define;
    return (
      <div>
        <p>
          ???????????????: {0} - {max}
        </p>
      </div>
    );
  };

  const timestampRender = () => {
    return (
      <div>
        <p>INT?????????UTC??????????????????</p>
      </div>
    );
  };

  const renderMap = (type: string, record: ProductSchemaInfo) => {
    const map = {
      bool: boolRender,
      int: intRender,
      float: intRender,
      string: stringRender,
      enum: boolRender,
      timestamp: timestampRender,
    };
    if (!map[type]) {
      return '-';
    }
    return map[type](record) ?? '-';
  };

  const columns: ProColumns<ProductSchemaInfo>[] = [
    {
      title: '????????????',
      width: 80,
      dataIndex: 'type',
      valueEnum: TYPE_ENUM,
    },
    {
      title: '????????????',
      dataIndex: 'name',
    },
    {
      title: '?????????',
      dataIndex: 'identifier',
    },
    {
      title: '????????????',
      width: 80,
      dataIndex: 'dataType',
      render: (_: any, record: ProductSchemaInfo) => {
        return DATA_TYPE_ENUM[JSON.parse(record?.affordance)?.define?.type] ?? '-';
      },
    },
    {
      title: '????????????',
      width: 80,
      key: 'mode',
      dataIndex: 'mode',
      render: (_: any, record: ProductSchemaInfo) => {
        return MODE_ENUM[JSON.parse(record?.affordance)?.mode] ?? '-';
      },
    },
    {
      title: '????????????',
      dataIndex: 'affordance',
      render: (_: any, record: ProductSchemaInfo) => {
        const type = JSON.parse(record?.affordance)?.define?.type;
        return renderMap(type, record);
      },
    },
    {
      title: '??????',
      width: 180,
      key: 'option',
      valueType: 'option',
      render: (text, record: ProductSchemaInfo) => [
        <a
          key="view"
          onClick={() => {
            if (modelModalRef.current) {
              console.log('record11', record);
              modelModalRef.current.setModelModalValue(record, true);
            }
          }}
        >
          ??????
        </a>,
        <Button
          danger
          key="deleteProduct"
          onClick={async () => {
            Modal.confirm({
              title: '???????????????????????????',
              icon: <ExclamationCircleOutlined />,
              content: '??????????????????????????????',
              async onOk() {
                const { identifier, productID } = record;
                const params = {
                  productID,
                  identifier,
                };
                const res = await postThingsProductSchema__openAPI__delete(params);
                if (res instanceof Response) {
                  return;
                }
                message.success('????????????');
                actionRef.current?.reload();
              },
              onCancel() { },
            });
          }}
        >
          ??????
        </Button>,
      ],
    },
  ];

  const queryList = async (
    params: Partial<queryParam>,
  ): Promise<{ data?: ProductSchemaInfo[]; total?: number }> => {
    const param = {
      productID,
      page: {
        size: params.pageSize,
        page: params.current,
      },
    };
    const res = await postThingsProductSchemaIndex(param);
    if (res instanceof Response) {
      return {
        data: [],
        total: 0,
      };
    }

    return {
      data: res?.data?.list,
      total: res?.data?.total,
    };
  };

  const handleOk = async () => {
    if (jsonError) {
      message.error('JSON????????????????????????????????????');
      return;
    }
    const params = {
      productID,
      tsl,
    };
    const res = await postThingsProductSchemaTslImport(params);
    if (res instanceof Response) {
      return;
    }
    setIsImportModalVisible(false);

    message.success('????????????');
    actionRef.current?.reload()
    setTsl('');
  };

  const handleCancel = () => {
    setIsImportModalVisible(false);
    setTsl('');
  };

  const handleExportCancel = () => {
    setIsExportModalVisible(false);
  };

  const download = async () => {
    const filename = 'tls.json';
    const content = JSON.stringify(exportJSON);
    downloadFunction(content, filename);
  };

  const importModal = (
    <Modal title="???????????????" open={isImportModalVisible} onOk={handleOk} onCancel={handleCancel}>
      <Alert message="?????????????????????JSON??????????????????????????????????????????" type="info" showIcon />
      <div style={{ margin: '10px 0' }}>
        <Input.TextArea
          value={tsl}
          rows={15}
          onChange={(e) => {
            const text = e.target.value;
            const flag = isJSON(text);
            setJsonError(!flag);
            setTsl(e.target.value);
          }}
        />
      </div>
    </Modal>
  );
  const exportModal = (
    <Modal
      title="???????????????JSON"
      footer={null}
      open={isExportModalVisible}
      onCancel={handleExportCancel}
    >
      <div className={styles['action-wrap']}>
        <div>?????????????????????????????????????????????????????????JSON????????????</div>
        <div>
          <DownloadOutlined className={styles.btn} onClick={download} />
          <CopyToClipboard
            text={JSON.stringify(exportJSON)}
            onCopy={() => {
              message.success('????????????');
            }}
          >
            <CopyOutlined className={styles.btn} />
          </CopyToClipboard>
        </div>
      </div>
      <div style={{ margin: '10px 0' }}>
        <JSONInput
          id="a_unique_id"
          viewOnly={true}
          colors={{
            default: '#000',
            background: '#fff',
            string: '#000',
            number: '#000',
            colon: '#000',
            keys: '#000',
          }}
          placeholder={exportJSON}
          style={{
            body: {
              border: '1px solid #000',
            },
          }}
          locale={locale}
          height="550px"
        />
      </div>
    </Modal>
  );

  return (
    <>
      <Button
        type="primary"
        style={{ marginRight: 10 }}
        onClick={() => {
          setIsImportModalVisible(true);
        }}
      >
        ???????????????
      </Button>
      <Button
        onClick={async () => {
          const res = await postThingsProductSchemaTslRead({ productID });
          if (res instanceof Response) {
            return;
          }
          setExportJSON(JSON.parse(res?.data?.tsl) ?? {});

          setIsExportModalVisible(true);
        }}
      >
        ???????????????JSON
      </Button>
      <ProTable<ProductSchemaInfo>
        rowKey="key"
        pagination={{
          showQuickJumper: true,
        }}
        columns={columns}
        search={false}
        actionRef={actionRef}
        dateFormatter="string"
        headerTitle="???????????????"
        request={queryList}
        toolBarRender={() => [
          <Button
            key="show"
            type="primary"
            onClick={() => {
              modelModalRef.current.createModel();
            }}
          >
            ?????????????????????
          </Button>,
        ]}
      />
      <EditForm
        modalVisit={modalVisit}
        setModalVisit={setModalVisit}
        ref={modelModalRef}
        actionRef={actionRef}
      />
      {importModal} {exportModal}
    </>
  );
};
