import { SettingItem, SettingItemBox } from '@/components/pages/ChartItemSetting';
import { EditOutlined } from '@ant-design/icons';
import { Button, Card, Input, InputNumber, Select, Tag, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import { selectTimeOptions } from '../../../../index.d';
import RequestGlobalHeaderTable from '../RequestGlobalHeaderTable';

const Index: React.FC = () => {
  const setDispatch = useDispatch();
  const { requestGlobalConfig } = useSelector((state) => state.chartEditStore);
  const { requestOriginUrl, requestInterval, requestIntervalUnit } = requestGlobalConfig || {};

  const [showTable, setShowTable] = useState(false);
  const editDisabledRef = useRef(true);

  const onShow = () => setShowTable(true);
  const closeShow = () => setShowTable(false);

  const handleChange = (key, value) => {
    setDispatch({
      type: 'chartEditStore/setRequestGlobalConfig',
      payload: {
        key,
        value,
      },
    });
  };
  return (
    <Card className="n-card-shallow">
      <Tag color="" style={{ borderRadius: '5px' }}>
        <SettingItemBox name="服务" itemRightStyle={{ gridTemplateColumns: '5fr 2fr 1fr' }}>
          <div slot="default">
            <SettingItem name="前置 URL">
              <Input
                value={requestOriginUrl}
                disabled={editDisabledRef.current}
                placeholder="例：http://127.0.0.1/"
                onChange={(value) => handleChange('requestOriginUrl', value)}
              />
            </SettingItem>
            <SettingItem name="更新间隔，为 0 只会初始化">
              <Input.Group>
                <InputNumber
                  className="select-time-number"
                  min={0}
                  value={requestInterval}
                  disabled={editDisabledRef.current}
                  placeholder="请输入数字"
                  onChange={(value) => handleChange('requestInterval', value)}
                />
                {/*单位*/}
                <Select
                  size="small"
                  className="color-select select-time-options"
                  value={requestIntervalUnit}
                  onChange={(value) => handleChange('requestIntervalUnit', value)}
                  options={selectTimeOptions}
                  popupClassName="select-option"
                />
              </Input.Group>
            </SettingItem>
            {editDisabledRef.current && (
              <Button
                type="primary"
                ghost
                onClick={() => (editDisabledRef.current = false)}
                icon={<EditOutlined />}
              >
                编辑配置
              </Button>
            )}
            {/*table内容体*/}
            {showTable && <RequestGlobalHeaderTable editDisabled={editDisabledRef.current} />}
            {/*箭头*/}
            {showTable ? (
              <div className="ithings-flex-center go-mt-3 down" onClick={closeShow}>
                <EditOutlined />
              </div>
            ) : (
              <div className="ithings-flex-center go-mt-3 down" onClick={onShow}>
                展开
                <Tooltip>
                  <EditOutlined />
                </Tooltip>
              </div>
            )}
          </div>
        </SettingItemBox>
      </Tag>
    </Card>
  );
};
export default Index;
