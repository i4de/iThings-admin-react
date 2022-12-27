import { GlobalSetting } from '@/components/pages/ChartItemSetting';
import CollapseItem from '@/components/pages/ChartItemSetting/CollapseItem';
import SettingItem from '@/components/pages/ChartItemSetting/SettingItem';
import SettingItemBox from '@/components/pages/ChartItemSetting/SettingItemBox';
import { useTargetData } from '@/pages/visualizations/screen/detail/pages/pageConfiguration/hooks/useTargetData';
import { InputNumber, Popover, Select, Space, Switch, Typography } from 'antd';
import React, { useMemo, useState } from 'react';
import ReactGPicker from 'react-gcolor-picker';
import { useDispatch } from 'umi';

import '@/pages/visualizations/screen/detail/pages/pageConfiguration/styles.less';

const { Text } = Typography;

const Arrange: React.FC = () => {
  const setDispatch = useDispatch();
  const { selectTarget } = useTargetData();

  const [isShowColor, setIsShowColor] = useState(false);

  const seriesList = useMemo(() => {
    return selectTarget.option.series;
  }, [selectTarget.option.series]);

  // 处理input
  const handleInputChange = (value, obj, key) => {
    if (obj.includes('.')) {
      const curObj = obj.split('.');
      setDispatch({
        type: 'chartEditStore/setChartAttr',
        payload: {
          key: curObj[1],
          value: {
            ...grid[curObj[0]],
            [key]: value,
          },
        },
      });
    }
  };

  // 处理 color picker
  const chromeColorHandle = () => setIsShowColor(!isShowColor);

  return (
    <>
      {/*Echarts 全局设置*/}
      <GlobalSetting />
      {seriesList.map((item, index) => (
        <CollapseItem name={`柱状图-${index + 1}`} expanded={true} key={index}>
          <SettingItemBox name="图形">
            <SettingItem name="宽度">
              <InputNumber
                value={item.barWidth}
                min={1}
                max={100}
                onChange={(value) => handleInputChange(value, item, 'barWidth')}
                size="small"
                placeholder="自动计算"
                className="radius set-input-width"
              />
            </SettingItem>
            <SettingItem name="圆角">
              <InputNumber
                value={item.itemStyle.borderRadius}
                min={0}
                onChange={(value) => handleInputChange(value, item.itemStyle, 'borderRadius')}
                size="small"
                placeholder="自动计算"
                className="radius set-input-width"
              />
            </SettingItem>
          </SettingItemBox>
          <SettingItemBox name="标签">
            <SettingItem name="展示">
              <Space>
                <Switch
                  checked={item.label.show}
                  size="small"
                  onChange={(value) => handleInputChange(value, item.label, 'show')}
                />
                <Text>展示标签</Text>
              </Space>
            </SettingItem>
            <SettingItem name="大小">
              <InputNumber
                value={item.label.fontSize}
                min={1}
                onChange={(value) => handleInputChange(value, item.label, 'fontSize')}
                size="small"
                className="radius set-input-width"
              />
            </SettingItem>
            <SettingItem name="颜色">
              <div className="color-pick radius">
                <Popover
                  content={
                    <div className="color-set">
                      {isShowColor && (
                        <ReactGPicker
                          value={item.label.color}
                          format="hex"
                          onChange={handleInputChange}
                        />
                      )}
                    </div>
                  }
                  trigger="click"
                  placement="bottom"
                >
                  <div
                    className="picker-height radius"
                    onClick={chromeColorHandle}
                    style={{ backgroundColor: item.label.color }}
                  >
                    {item.label.color || '#000'}
                  </div>
                </Popover>
              </div>
            </SettingItem>
            <SettingItem name="位置">
              <Select
                size="small"
                className="color-select set-input-width"
                value={item.label.position}
                onChange={(value) => handleInputChange(value, item.label, 'position')}
                options={[
                  { label: 'top', value: 'top' },
                  { label: 'left', value: 'left' },
                  { label: 'right', value: 'right' },
                  { label: 'bottom', value: 'bottom' },
                ]}
                popupClassName="select-option"
              />
            </SettingItem>
          </SettingItemBox>
        </CollapseItem>
      ))}
    </>
  );
};
export default Arrange;
