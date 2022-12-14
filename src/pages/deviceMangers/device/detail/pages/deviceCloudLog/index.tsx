import TimeFilter from '@/components/TimeFilter';
import {
  postThingsDeviceMsgEventLogIndex,
  postThingsDeviceMsgHubLogIndex,
  postThingsDeviceMsgPropertyLatestIndex,
} from '@/services/iThingsapi/shebeixiaoxi';
import { postThingsProductSchemaIndex } from '@/services/iThingsapi/wumoxing';
import { DefaultPage, getInitialTime } from '@/utils/base';
import { EVENT_TYPE_DATA } from '@/utils/const';
import { SyncOutlined } from '@ant-design/icons';
import Switch from '@ant-design/pro-form/lib/components/Switch';
import { useAntdTable, useRequest } from 'ahooks';
import type { RadioChangeEvent } from 'antd';
import { Form, Input, Radio, Select, Space, Table } from 'antd';
import type { RangePickerProps } from 'antd/lib/date-picker';
import { debounce } from 'lodash';
import 'moment/locale/zh-cn';
import type { ChangeEventHandler } from 'react';
import React, { useEffect, useState } from 'react';
import type { DeviceInfo, PageInfo } from '../../../data';
import type { AttrData } from './data';
import { LogType, ModelType } from './enum';
import { contentColumns, eventColumns, getAttrColumns, onofflineColumns } from './getColumns';
import styles from './index.less';
import ModelDetail from './modelDialog';

const { Search } = Input;
const { Option, OptGroup } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const DevicePage: React.FC<DeviceInfo> = (props) => {
  const { productID, deviceName } = props;

  const initialTime = getInitialTime();

  const [modelTYpe, setModelType] = useState('property');
  const [logType, setLogType] = useState('model');
  const [contentParams, setContentParams] = useState({ actions: '', topics: '' });
  const [dataID, setDataID] = useState('');
  const [historyDataID, setHistoryDataID] = useState('');
  const [isRefresh, setRefresh] = useState(false);
  const [eventType, setEventType] = useState<string>(null!);
  const [timeRange, setTimeRange] = useState<RangePickerProps['value']>(initialTime);
  const [attrList, setAttrList] = useState<Partial<AttrData>[]>([]);

  const [visible, setVisible] = useState(false);

  // ???????????????-??????????????????
  const [modelData, setModelData] = useState<Partial<AttrData>[]>([]);

  // ????????????????????? - ??????
  const {
    data: attrData,
    loading: attrLoading,
    refresh: attrRun,
  } = useRequest(
    async () => {
      const res = await postThingsDeviceMsgPropertyLatestIndex({
        productID,
        deviceName,
        dataIDs: [],
      });
      return res.data;
    },
    {
      ready:
        logType === LogType.MODEL &&
        modelTYpe === ModelType.PROPERTY &&
        !!(productID && deviceName),
      refreshDeps: [isRefresh, logType, modelTYpe],
      pollingInterval:
        isRefresh && logType === LogType.MODEL && modelTYpe === ModelType.PROPERTY ? 5000 : 0,
    },
  );

  // ?????????????????????
  const { data: modelList } = useRequest(
    async () => {
      const res = await postThingsProductSchemaIndex({
        productID,
        type: 1,
      });
      return res.data;
    },
    {
      ready:
        logType === LogType.MODEL &&
        modelTYpe === ModelType.PROPERTY &&
        !!(productID && deviceName),
      refreshDeps: [isRefresh, logType, modelTYpe],
      pollingInterval:
        isRefresh && logType === LogType.MODEL && modelTYpe === ModelType.PROPERTY ? 5000 : 0,
    },
  );

  // ?????????????????????
  useEffect(() => {
    if (modelList && attrData) {
      const arr: Partial<AttrData>[] = [];
      modelList?.list?.forEach((item) => {
        attrData.list?.some((list) => {
          if (list.dataID === item.identifier) {
            arr.push({
              ...list,
              name: item.name,
              affordance: JSON.parse(item.affordance).define.type,
            });
          }
          return list.dataID === item.identifier;
        });
      });
      setAttrList(arr);
    }
  }, [attrData, modelList]);

  // ???????????????????????????
  useEffect(() => {
    if (attrList.length > 0) {
      setModelData(
        () => (dataID ? attrList?.filter((item) => item.dataID?.includes(dataID)) : attrList) || [],
      );
    }
  }, [dataID, attrList]);

  /** ???????????????-?????? */
  const eventTable = async ({ current, pageSize }: PageInfo) => {
    // ???????????????
    const page = {
      page: current,
      size: pageSize,
    };
    const _params = {
      deviceNames: [deviceName],
      types: eventType === 'all' ? null! : [eventType],
      productID,
      dataID: '',
      timeStart: timeRange?.[0]?.valueOf().toString() ?? '',
      timeEnd: timeRange?.[1]?.valueOf().toString() ?? '',
      page,
    };

    const res = await postThingsDeviceMsgEventLogIndex(_params);
    const result = res?.data;
    return {
      list: result?.list || [],
      total: result.total || 0,
    };
  };

  // ????????????????????? - ??????
  const { tableProps: eventTableProps, refresh: eventRun } = useAntdTable(eventTable, {
    ready:
      logType === LogType.MODEL && modelTYpe === ModelType.EVENT && !!(productID && deviceName),
    defaultPageSize: DefaultPage.size,
    refreshDeps: [timeRange, eventType, isRefresh],
    pollingInterval:
      isRefresh && logType === LogType.MODEL && modelTYpe === ModelType.EVENT ? 5000 : 0,
  });

  /** ?????????????????? */
  const contentTable = async ({ current, pageSize }: PageInfo) => {
    // ???????????????
    const page = {
      page: current,
      size: pageSize,
    };
    const _params = {
      actions: contentParams.actions ? [contentParams.actions] : ['property', 'event', 'action'],
      topics: contentParams.topics ? [contentParams.topics] : null!,
      deviceName,
      productID,
      timeStart: timeRange?.[0]?.valueOf().toString() ?? '',
      timeEnd: timeRange?.[1]?.valueOf().toString() ?? '',
      page,
    };

    const res = await postThingsDeviceMsgHubLogIndex(_params);
    const result = res?.data;
    return {
      list: result?.list || [],
      total: result.total || 0,
    };
  };

  // ??????????????????
  const { tableProps: contentTableProps, refresh: contentRun } = useAntdTable(contentTable, {
    ready: logType === LogType.CONTENT && !!(productID && deviceName),
    defaultPageSize: DefaultPage.size,
    refreshDeps: [timeRange, contentParams, isRefresh],
    pollingInterval: isRefresh && logType === LogType.CONTENT ? 5000 : 0,
  });

  /** ????????????????????? */
  const onOffTable = async ({ current, pageSize }: PageInfo) => {
    // ???????????????
    const page = {
      page: current,
      size: pageSize,
    };
    const _params = {
      actions: ['connected', 'disconnected'],
      deviceName,
      productID,
      timeStart: timeRange?.[0]?.valueOf().toString() ?? '',
      timeEnd: timeRange?.[1]?.valueOf().toString() ?? '',
      page,
    };

    const res = await postThingsDeviceMsgHubLogIndex(_params);
    const result = res?.data;
    return {
      list: result?.list || [],
      total: result.total || 0,
    };
  };

  // ?????????????????????
  const { tableProps: onOffTableProps, refresh: onOffRun } = useAntdTable(onOffTable, {
    ready: logType === LogType.ONOFFLINE && !!(productID && deviceName),
    defaultPageSize: DefaultPage.size,
    refreshDeps: [timeRange, isRefresh],
    pollingInterval: isRefresh && logType === LogType.ONOFFLINE ? 5000 : 0,
  });

  /** ?????????????????? */
  const handleHistory = (record: Partial<AttrData>) => {
    setVisible(true);
    setHistoryDataID(record.dataID ?? '');
  };

  const attrColumns = getAttrColumns(handleHistory);

  /** ?????????????????? */
  const logTypeChange = (e: RadioChangeEvent) => {
    setLogType(e.target.value);
    /** ???????????????????????? */
    setModelType('property');
    setTimeRange(initialTime);
    setEventType(null!);
    setContentParams({
      actions: '',
      topics: '',
    });
  };

  /** ?????????????????????????????? */
  const modelTypeLogChange = (e: RadioChangeEvent) => {
    setModelType(e.target.value);
    setEventType('all');
  };

  /** ?????????????????? */
  const refreshChange = (checked: boolean) => {
    setRefresh(checked);
  };

  /** ???????????????-??????????????? */
  const attrSearch = (value: string) => {
    setDataID(value);
  };

  /** ???????????????-??????-???????????? */
  const handleEventChange = (value: string) => {
    setEventType(value);
  };

  /** ????????????????????????????????? */
  const handleLogTypeChange = (value: string) => {
    setContentParams((val) => ({
      ...val,
      actions: value,
    }));
  };

  /** ??????????????????topics */
  const handleChangeTopics: ChangeEventHandler<HTMLInputElement> = (e) => {
    setContentParams((val) => ({
      ...val,
      topics: e.target.value,
    }));
  };

  /** ???????????????????????? */
  const handleClose = () => {
    setVisible(false);
  };

  /** ???????????? */
  const refresh = () => {
    if (logType === LogType.MODEL && modelTYpe === ModelType.PROPERTY) attrRun();
    if (logType === LogType.MODEL && modelTYpe === ModelType.EVENT) eventRun();
    if (logType === LogType.CONTENT) contentRun();
    if (logType === LogType.ONOFFLINE) onOffRun();
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space>
        <Radio.Group value={logType} onChange={logTypeChange}>
          <Radio.Button value="model">???????????????</Radio.Button>
          <Radio.Button value="content">????????????</Radio.Button>
          <Radio.Button value="onoffline">???????????????</Radio.Button>
        </Radio.Group>
        <div className={styles.refresh}>
          <SyncOutlined className={styles['refresh-icon']} onClick={refresh} />
          <Switch fieldProps={{ onChange: refreshChange }} />
          <span style={{ paddingLeft: 10 }}>????????????</span>
        </div>
      </Space>
      {logType === LogType.MODEL ? (
        <div>
          <Radio.Group value={modelTYpe} onChange={modelTypeLogChange} style={{ marginTop: 30 }}>
            <Radio.Button value="property">??????</Radio.Button>
            <Radio.Button value="event">??????</Radio.Button>
          </Radio.Group>
        </div>
      ) : (
        ''
      )}
      <div>
        {logType === LogType.CONTENT && (
          <Form {...layout} layout="inline" style={{ marginTop: 20 }}>
            <Form.Item name="actions" label="????????????">
              <Select style={{ width: 200 }} onChange={handleLogTypeChange} placeholder="?????????">
                <OptGroup label="?????????topic">
                  <Option value="property">??????</Option>
                  <Option value="event">??????</Option>
                  <Option value="action">??????</Option>
                </OptGroup>
              </Select>
            </Form.Item>
            <Form.Item name="topics" label="topic">
              <Input
                style={{ width: 300 }}
                placeholder="?????????topic"
                onChange={debounce(handleChangeTopics, 300)}
                allowClear
              />
            </Form.Item>
          </Form>
        )}
      </div>
      <div className={styles.filter}>
        {logType === LogType.MODEL && modelTYpe === ModelType.EVENT && (
          <div style={{ marginBottom: 20, marginTop: 20 }}>
            <Select
              value={eventType}
              style={{ width: 150, marginRight: 20 }}
              onChange={handleEventChange}
              options={EVENT_TYPE_DATA}
            />
          </div>
        )}
        {(modelTYpe === ModelType.EVENT || logType !== LogType.MODEL) && (
          <div style={{ marginBottom: 20, marginTop: 20 }}>
            <TimeFilter onChange={(val) => setTimeRange(val)} />
          </div>
        )}
      </div>
      {logType === LogType.MODEL && modelTYpe === 'property' && (
        <div>
          <Search
            placeholder="???????????????"
            onSearch={attrSearch}
            style={{ width: 200, marginBottom: 20, marginTop: 20 }}
            allowClear
          />
          <Table
            rowKey="dataID"
            pagination={false}
            size="middle"
            dataSource={modelData}
            columns={attrColumns}
            loading={attrLoading}
          />
        </div>
      )}

      {logType === LogType.MODEL && modelTYpe === 'event' && (
        <Table size="middle" rowKey="dataID" columns={eventColumns} {...eventTableProps} />
      )}
      {logType === LogType.CONTENT && (
        <Table size="middle" rowKey="tranceID" columns={contentColumns} {...contentTableProps} />
      )}
      {logType === LogType.ONOFFLINE && (
        <Table size="middle" rowKey="tranceID" columns={onofflineColumns} {...onOffTableProps} />
      )}
      {visible && (
        <ModelDetail visible={visible} dataID={historyDataID} handleClose={handleClose} />
      )}
    </Space>
  );
};

export default DevicePage;
