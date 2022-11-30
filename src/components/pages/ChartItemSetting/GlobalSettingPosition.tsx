import SettingItem from '@/components/pages/ChartItemSetting/SettingItem';
import { useTargetData } from '@/pages/visualizations/screen/detail/pages/pageConfiguration/hooks/useTargetData';
import { InputNumber } from 'antd';
import React, { useMemo } from 'react';
import { useDispatch } from 'umi';
import SettingItemBox from './SettingItemBox';

const GlobalSettingPosition: React.FC = () => {
  const setDispatch = useDispatch();

  const { selectTarget } = useTargetData();

  const visualMap = useMemo(() => {
    return selectTarget.option.visualMap;
  }, [selectTarget.option.visualMap]);

  // 处理input
  const handleInputChange = (value, obj, key) => {
    if (obj.includes('.')) {
      const curObj = obj.split('.');
      setDispatch({
        type: 'chartEditStore/setChartAttr',
        payload: {
          key: curObj[1],
          value: {
            ...visualMap[curObj[0]],
            [key]: value,
          },
        },
      });
    }

    setDispatch({
      type: 'chartEditStore/setChartAttr',
      payload: {
        key: obj,
        value: {
          ...visualMap,
          [key]: value,
        },
      },
    });
  };

  return (
    <>
      <SettingItemBox name="位置">
        <div slot="default">
          <SettingItem name={`偏移 X：${visualMap?.left || 0}px`}>
            <InputNumber
              value={visualMap?.left}
              step={10}
              onChange={(value) => handleInputChange(value, 'visualMap', 'left')}
              size="small"
            />
          </SettingItem>
          <SettingItem name={`偏移 Y：${visualMap?.top || 0}px`}>
            <InputNumber
              value={visualMap?.top}
              step={10}
              onChange={(value) => handleInputChange(value, 'visualMap', 'top')}
              size="small"
            />
          </SettingItem>
        </div>
      </SettingItemBox>
    </>
  );
};
export default GlobalSettingPosition;
