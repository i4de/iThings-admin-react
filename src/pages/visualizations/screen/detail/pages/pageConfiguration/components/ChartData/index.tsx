import SettingItemBox from '@/components/pages/ChartItemSetting/SettingItemBox';
import { RequestDataTypeEnum } from '@/enums/httpEnum';
import { useTargetData } from '@/pages/visualizations/screen/detail/pages/pageConfiguration/hooks/useTargetData';
import { Select } from 'antd';
import React, { useMemo } from 'react';
import { useDispatch } from 'umi';
import ChartDataAjax from './components/ChartDataAjax';
import ChartDataStatic from './components/ChartDataStatic';
import { SelectCreateDataEnum, SelectCreateDataType } from './index.d';

const ChartData: React.FC = () => {
  const setDispatch = useDispatch();
  const { selectTarget } = useTargetData();

  const isNotData = useMemo(() => {
    return typeof selectTarget.option.dataset === 'undefined';
  }, [selectTarget.option.dataset]);

  // 选项
  const selectOptions: SelectCreateDataType[] = [
    {
      label: SelectCreateDataEnum.STATIC,
      value: RequestDataTypeEnum.STATIC,
    },
    {
      label: SelectCreateDataEnum.AJAX,
      value: RequestDataTypeEnum.AJAX,
    },
  ];

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

    setDispatch({
      type: 'chartEditStore/setChartAttr',
      payload: {
        key: obj,
        value: {
          ...grid,
          [key]: value,
        },
      },
    });
  };

  return (
    <>
      {selectTarget && (
        <div className="ithings-chart-configurations-data">
          <SettingItemBox name="请求方式" alone={true}>
            <div slot="default">
              <Select
                size="small"
                className="color-select"
                style={{ width: '263px' }}
                value={selectTarget.request.requestDataType}
                onChange={(value) =>
                  handleInputChange(value, 'selectTarget.request', 'requestDataType')
                }
                options={selectOptions}
                popupClassName="select-option"
                disabled={isNotData}
              />
            </div>
          </SettingItemBox>

          {
            // 静态
            selectTarget.request.requestDataType === RequestDataTypeEnum.STATIC ? (
              <ChartDataStatic />
            ) : (
              // 动态
              <ChartDataAjax />
            )
          }
        </div>
      )}
    </>
  );
};
export default ChartData;
