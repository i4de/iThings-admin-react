import { SettingItem, SettingItemBox } from '@/components/pages/ChartItemSetting';
import { useTargetData } from '@/pages/visualizations/screen/detail/pages/pageConfiguration/hooks/useTargetData';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Divider, Input, InputNumber, Select, Tooltip, Typography } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'umi';
import {
  capsuleUrl,
  chartDataUrl,
  chartSingleDataUrl,
  heatMapUrl,
  imageUrl,
  mapUrl,
  numberFloatUrl,
  numberIntUrl,
  radarUrl,
  rankListUrl,
  scatterBasicUrl,
  scrollBoardUrl,
  textUrl,
  threeEarth01Url,
  treemapUrl,
  wordCloudUrl,
} from '../../../../../../../../../../../../../mock/screen';
import { selectTimeOptions, selectTypeOptions } from '../../../../index.d';
import RequestHeader from '../RequestHeader';

const { Text } = Typography;

const RequestTargetConfig: React.FC = () => {
  const setDispatch = useDispatch();
  const { selectTarget } = useTargetData();
  const { requestGlobalConfig } = useSelector((state) => state.chartEditStore);

  const { requestOriginUrl } = requestGlobalConfig || {};
  const { requestInterval, requestIntervalUnit, requestHttpType, requestUrl } =
    selectTarget?.request;

  const handleChange = (key, value) => {
    setDispatch({
      type: 'chartEditStore/setRequestGlobalConfig',
      payload: {
        key,
        value,
      },
    });
  };

  const apiList = [
    {
      value: `【图表】${chartDataUrl}`,
    },
    {
      value: `【单数据图表】${chartSingleDataUrl}`,
    },
    {
      value: `【文本】${textUrl}`,
    },
    {
      value: `【0~100 整数】${numberIntUrl}`,
    },
    {
      value: `【0~1小数】${numberFloatUrl}`,
    },
    {
      value: `【图片地址】${imageUrl}`,
    },
    {
      value: `【排名列表】${rankListUrl}`,
    },
    {
      value: `【滚动表格】${scrollBoardUrl}`,
    },
    {
      value: `【雷达】${radarUrl}`,
    },
    {
      value: `【热力图】${heatMapUrl}`,
    },
    {
      value: `【基础散点图】${scatterBasicUrl}`,
    },
    {
      value: `【地图数据】${mapUrl}`,
    },
    {
      value: `【胶囊柱图】${capsuleUrl}`,
    },
    {
      value: `【词云】${wordCloudUrl}`,
    },
    {
      value: `【树图】${treemapUrl}`,
    },
    {
      value: `【三维地球】${threeEarth01Url}`,
    },
  ];
  return (
    <>
      {/*组件配置*/}
      <Divider className="ithings-my-3" orientation="left" />
      <SettingItemBox
        itemRightStyle={{
          gridTemplateColumns: '5fr 2fr 1fr',
        }}
      >
        <div slot="name">
          地址
          {process.env === 'development' && (
            <Tooltip
              title={
                <ul className="ithings-pl-0">
                  开发环境使用 mock 数据，请输入
                  {apiList.map((item) => (
                    <li key="item.value">
                      <Text color="#2788f3"> {item.value} </Text>
                    </li>
                  ))}
                </ul>
              }
            >
              <QuestionCircleOutlined />
            </Tooltip>
          )}
        </div>
        <div slot="default">
          <SettingItem name="请求方式 & URL 地址">
            <Input.Group>
              <Select
                size="small"
                className="color-select elect-type-options"
                value={requestHttpType}
                onChange={(value) => handleChange('requestHttpType', value)}
                options={selectTypeOptions}
                popupClassName="select-option"
              />
              <Input
                className="select-time-number"
                value={requestUrl}
                placeholder="请输入地址（去除前置URL）"
                onChange={(value) => handleChange('requestUrl', value)}
                prefix={
                  <>
                    <Text>{requestOriginUrl}</Text>
                    <Divider type="vertical" />
                  </>
                }
              />
            </Input.Group>
          </SettingItem>
          {/*组件url*/}
          <SettingItem name="更新间隔，为 0 只会初始化">
            <Input.Group>
              {/*单位*/}
              <Select
                size="small"
                className="color-select elect-type-options"
                value={requestIntervalUnit}
                onChange={(value) => handleChange('requestIntervalUnit', value)}
                options={selectTimeOptions}
                popupClassName="select-option"
              />
              <InputNumber
                className="select-time-number"
                value={requestInterval}
                placeholder="默认使用全局数据"
                onChange={(value) => handleChange('requestInterval', value)}
                min={0}
              />
            </Input.Group>
          </SettingItem>
        </div>
      </SettingItemBox>
      <SettingItemBox name="选择方式" className="ithings-mt-0">
        <RequestHeader />
      </SettingItemBox>
    </>
  );
};
export default RequestTargetConfig;
