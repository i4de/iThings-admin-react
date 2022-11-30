import { useTargetData } from '@/pages/visualizations/screen/detail/pages/pageConfiguration/hooks/useTargetData';
import { PicLeftOutlined } from '@ant-design/icons';
import { Button, Divider, InputNumber, Space, Tooltip } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'umi';
import SettingItemBox from './SettingItemBox';

const PositionSetting: React.FC = () => {
  const setDispatch = useDispatch();
  const { selectTarget } = useTargetData();
  const { editCanvasConfig } = useSelector((state) => state.chartEditStore);

  const positionList = [
    {
      key: 'AlignHorizontalLeftIcon',
      lable: '局左',
      icon: <PicLeftOutlined />,
    },
    {
      key: 'AlignVerticalCenterIcon',
      lable: 'X轴居中',
      icon: <PicLeftOutlined />,
    },
    {
      key: 'AlignHorizontalRightIcon',
      lable: '局右',
      icon: <PicLeftOutlined />,
    },
    {
      key: 'AlignVerticalTopIcon',
      lable: '顶部',
      icon: <PicLeftOutlined />,
    },
    {
      key: 'AlignHorizontalCenterIcon',
      lable: 'Y轴居中',
      icon: <PicLeftOutlined />,
    },
    {
      key: 'AlignVerticalBottomIcon',
      lable: '底部',
      icon: <PicLeftOutlined />,
    },
  ];

  // TODO: 位置定位计算问题
  const positonHandle = (key: string) => {
    switch (key) {
      // 局左
      case positionList[0].key:
        setDispatch({
          type: 'chartEditStore/setChartAttr',
          payload: {
            key: 'x',
            value: 0,
          },
        });
        break;
      // X轴居中
      case positionList[1].key:
        setDispatch({
          type: 'chartEditStore/setChartAttr',
          payload: {
            key: 'y',
            value: (editCanvasConfig.height - selectTarget.attr.h) / 2,
          },
        });
        break;
      // 局右
      case positionList[2].key:
        setDispatch({
          type: 'chartEditStore/setChartAttr',
          payload: {
            key: 'x',
            value: editCanvasConfig.width - selectTarget.attr.w,
          },
        });
        break;
      // 顶部
      case positionList[3].key:
        setDispatch({
          type: 'chartEditStore/setChartAttr',
          payload: {
            key: 'y',
            value: 0,
          },
        });
        break;
      // Y轴居中
      case positionList[4].key:
        setDispatch({
          type: 'chartEditStore/setChartAttr',
          payload: {
            key: 'x',
            value: (editCanvasConfig.width - selectTarget.attr.w) / 2,
          },
        });
        break;
      // 底部
      case positionList[5].key:
        setDispatch({
          type: 'chartEditStore/setChartAttr',
          payload: {
            key: 'y',
            value: editCanvasConfig.height - selectTarget.attr.h,
          },
        });
        break;
    }
  };

  const handleInputNumberChange = (value, flag) => {
    setDispatch({
      type: 'chartEditStore/setChartAttr',
      payload: {
        key: flag,
        value,
      },
    });
  };

  return (
    <>
      <Divider style={{ margin: '10px 0' }} />
      <Space align="end" style={{ margin: '10px 0' }}>
        {positionList.map((item) => (
          <Tooltip title={item.lable} key={item.key}>
            <Button icon={item.icon} onClick={() => positonHandle(item.key)} />
          </Tooltip>
        ))}
      </Space>
      <SettingItemBox name="位置">
        <InputNumber
          value={selectTarget?.attr.y}
          min={0}
          placeholder="px"
          size="small"
          prefix="上"
          onChange={(value) => handleInputNumberChange(value, 'y')}
        />
        <InputNumber
          value={selectTarget?.attr.x}
          min={0}
          placeholder="px"
          size="small"
          prefix="左"
          onChange={(value) => handleInputNumberChange(value, 'x')}
        />
      </SettingItemBox>
    </>
  );
};
export default PositionSetting;
