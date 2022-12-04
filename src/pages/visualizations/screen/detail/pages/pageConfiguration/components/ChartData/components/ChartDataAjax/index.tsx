import IthingsSkeleton from '@/components/IthingsSkeleton';
import SettingItem from '@/components/pages/ChartItemSetting/SettingItem';
import SettingItemBox from '@/components/pages/ChartItemSetting/SettingItemBox';
import { RequestContentTypeEnum, SelectHttpTimeNameObj } from '@/enums/httpEnum';
import { useTargetData } from '@/pages/visualizations/screen/detail/pages/pageConfiguration/hooks/useTargetData';
import { PlusSquareOutlined, QuestionCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Card, Input, message, Space, Tag, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'umi';
import ChartDataMatchingAndShow from '../ChartDataMatchingAndShow';
import ChartDataRequest from '../ChartDataRequest';

const { Text } = Typography;

const ChartDataAjax: React.FC = () => {
  const { requestGlobalConfig } = useSelector((state) => state.chartEditStore);
  const { selectTarget } = useTargetData();

  const {
    requestOriginUrl,
    requestInterval: GlobalRequestInterval,
    requestIntervalUnit: GlobalRequestIntervalUnit,
  } = requestGlobalConfig || {};
  // 是否展示数据分析
  const [loading, setLoading] = useState(false);
  const [showMatching] = useState(false);
  const [requestShow, setRequestShow] = useState(false);

  // 请求配置 model
  const requestModelHandle = () => setRequestShow(true);

  // 发送请求
  const sendHandle = async () => {
    if (!selectTarget?.request) return;
    setLoading(true);
    try {
      // const res = await customizeHttp(toRaw(targetData.value.request), toRaw(chartEditStore.requestGlobalConfig))
      setLoading(false);
      // if (res) {
      //   if(!res?.data && !targetData.value.filter) window['$message'].warning('您的数据不符合默认格式，请配置过滤器！')
      //   targetData.value.option.dataset = newFunctionHandle(res?.data, res, targetData.value.filter)
      //   showMatching.value = true
      //   return
      // }
      message.warning('数据异常，请检查参数！');
    } catch (error) {
      setLoading(false);
      message.warning('数据异常，请检查参数！');
    }
  };

  return (
    <div className="ithings-chart-configurations-data-ajax">
      <Card className="n-card-shallow">
        <SettingItemBox name="请求配置">
          <div slot="default">
            <SettingItem name="类型">
              <Tag style={{ borderRadius: '5px' }}>
                {selectTarget.request.requestContentType === RequestContentTypeEnum.DEFAULT
                  ? '普通请求'
                  : 'SQL请求'}
              </Tag>
            </SettingItem>

            <SettingItem name="方式">
              <Input
                size="small"
                placeholder={selectTarget.request.requestHttpType || '暂无'}
                disabled={true}
              />
            </SettingItem>

            <SettingItem name="组件间隔（高级）">
              <Input
                size="small"
                placeholder={selectTarget.request.requestInterval || '暂无'}
                disabled={true}
                suffix={SelectHttpTimeNameObj[selectTarget?.request?.requestIntervalUnit]}
              />
            </SettingItem>

            <SettingItem name="全局间隔（默认）">
              <Input
                size="small"
                placeholder={GlobalRequestInterval || '暂无'}
                disabled={true}
                suffix={SelectHttpTimeNameObj[GlobalRequestIntervalUnit]}
              />
            </SettingItem>
          </div>
        </SettingItemBox>

        <SettingItemBox name="源地址" alone={true}>
          <div slot="default">
            <Input
              size="small"
              placeholder={requestOriginUrl || '暂无'}
              disabled={true}
              prefix={<PlusSquareOutlined />}
            />
          </div>
        </SettingItemBox>

        <SettingItemBox name="组件地址" alone={true}>
          <div slot="default">
            <Input
              size="small"
              placeholder={selectTarget.request.requestUrl || '暂无'}
              disabled={true}
              prefix={<PlusSquareOutlined />}
            />
          </div>
        </SettingItemBox>

        <Space align="end">
          <Text style={{ fontSize: '12px' }}>更新内容请点击展示区域</Text>
        </Space>

        <div className="edit-text" onClick={requestModelHandle}>
          <div className="ithings-absolute-center">
            <Button type="primary">查看更多</Button>
          </div>
        </div>
      </Card>
      <SettingItemBox alone={true}>
        <div slot="name">
          <Tooltip trigger="hover" title="默认赋值给 dataset 字段">
            测试
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
        <Button type="primary" ghost onClick={sendHandle} icon={<ThunderboltOutlined />}>
          发送请求
        </Button>
      </SettingItemBox>

      {/*底部数据展示*/}
      <ChartDataMatchingAndShow show={showMatching && !loading} ajax={true} />
      {/*骨架图*/}
      <IthingsSkeleton load={loading} repeat={3} />
      {/*请求配置model*/}
      <ChartDataRequest
        modelShow={requestShow}
        requestModelHandle={requestModelHandle}
        sendHandle={sendHandle}
      />
    </div>
  );
};
export default ChartDataAjax;
