import { axisConfig } from '@/packages/chartConfiguration/echarts/index';
import { Input, InputNumber, Popover, Select, Space, Switch } from 'antd';
import React, { useMemo, useState } from 'react';
import ReactGPicker from 'react-gcolor-picker';

import GlobalSettingPosition from '@/components/pages/ChartItemSetting/GlobalSettingPosition';
import { useTargetData } from '@/pages/visualizations/screen/detail/pages/pageConfiguration/hooks/useTargetData';
import { useDispatch } from 'umi';
import CollapseItem from './CollapseItem';
import SettingItem from './SettingItem';
import SettingItemBox from './SettingItemBox';

const GlobalSetting: React.FC = () => {
  const setDispatch = useDispatch();
  const { selectTarget } = useTargetData();

  const [isShowColor, setIsShowColor] = useState(false);

  const title = useMemo(() => {
    return selectTarget.option.title;
  }, [selectTarget.option.title]);

  const grid = useMemo(() => {
    return selectTarget.option.grid;
  }, [selectTarget.option.grid]);

  const xAxis = useMemo(() => {
    return selectTarget.option.xAxis;
  }, [selectTarget.option.xAxis]);

  const yAxis = useMemo(() => {
    return selectTarget.option.yAxis;
  }, [selectTarget.option.yAxis]);

  const legend = useMemo(() => {
    return selectTarget.option.legend;
  }, [selectTarget.option.legend]);

  const visualMap = useMemo(() => {
    return selectTarget.option.visualMap;
  }, [selectTarget.option.visualMap]);

  // TODO: 封装公共处理 Collapse switch的hooks

  // 处理 Collapse switch
  const switchHandle = (checked: boolean) => {
    setDispatch({
      type: 'chartEditStore/setChartOption',
      payload: {
        key: 'title',
        value: {
          ...title,
          show: checked,
        },
      },
    });
  };

  const genExtra = (value) => <Switch onChange={switchHandle} checked={value} />;

  // TODO: 封装公共 color picker的hooks

  // 处理 color picker
  const chromeColorHandle = () => setIsShowColor(!isShowColor);

  const colorPickHandle = (color: string) =>
    setDispatch({
      type: 'chartEditStore/setChartOption',
      payload: {
        key: 'title',
        value: {
          ...title.textStyle,
          color,
        },
      },
    });

  // 处理表单元素 inputNumber
  const handleInputNumberChange = (value, key) => {
    setDispatch({
      type: 'chartEditStore/setChartAttr',
      payload: {
        key: 'title',
        value: {
          ...title[key],
          fontSize: value,
        },
      },
    });
  };

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
      {title && (
        <CollapseItem name="标题" extraNode={() => genExtra(title.show)}>
          <SettingItemBox name="标题">
            <div slot="default">
              <SettingItem name="颜色">
                <div className="color-pick radius">
                  <Popover
                    content={
                      <div className="color-set">
                        {isShowColor && (
                          <ReactGPicker
                            value={title.textStyle.color}
                            format="hex"
                            onChange={colorPickHandle}
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
                      style={{ backgroundColor: title.textStyle.color }}
                    >
                      {title.textStyle.color || '#000'}
                    </div>
                  </Popover>
                </div>
              </SettingItem>
              <SettingItem name="大小">
                <InputNumber
                  value={title.textStyle.fontSize}
                  min={1}
                  size="small"
                  onChange={(value) => handleInputNumberChange(value, 'textStyle')}
                />
              </SettingItem>
            </div>
          </SettingItemBox>
          <SettingItemBox name="副标题">
            <SettingItem name="颜色">
              <div className="color-pick radius">
                <Popover
                  content={
                    <div className="color-set">
                      {isShowColor && (
                        <ReactGPicker
                          value={title.textStyle.color}
                          format="hex"
                          onChange={colorPickHandle}
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
                    style={{ backgroundColor: title.textStyle.color }}
                  >
                    {title.textStyle.color || '#000'}
                  </div>
                </Popover>
              </div>
            </SettingItem>
            <SettingItem name="大小">
              <InputNumber
                value={title.subtextStyle.fontSize}
                min={1}
                size="small"
                onChange={(value) => handleInputNumberChange(value, 'subtextStyle')}
              />
            </SettingItem>
          </SettingItemBox>
        </CollapseItem>
      )}

      {grid && (
        <CollapseItem name="容器">
          <SettingItemBox name="距离">
            <div slot="default">
              <SettingItem name="左侧距离">
                <Input
                  value={grid.left}
                  onChange={(value) => handleInputChange(value, 'grid', 'left')}
                  size="small"
                />
              </SettingItem>
              <SettingItem name="右侧距离">
                <Input
                  value={grid.right}
                  onChange={(value) => handleInputChange(value, 'grid', 'right')}
                  size="small"
                />
              </SettingItem>
              <SettingItem name="上侧距离">
                <Input
                  value={grid.top}
                  onChange={(value) => handleInputChange(value, 'grid', 'top')}
                  size="small"
                />
              </SettingItem>
              <SettingItem name="下侧距离">
                <Input
                  value={grid.bottom}
                  onChange={(value) => handleInputChange(value, 'grid', 'bottom')}
                  size="small"
                />
              </SettingItem>
            </div>
          </SettingItemBox>
        </CollapseItem>
      )}

      {xAxis && (
        <CollapseItem name="x轴" extraNode={() => genExtra(xAxis.show)}>
          <SettingItemBox name="单位">
            <div slot="default">
              <SettingItem name="名称">
                <Input
                  value={xAxis.name}
                  onChange={(value) => handleInputChange(value, 'xAxis', 'name')}
                  size="small"
                />
              </SettingItem>
              <SettingItem name="颜色">
                <div className="color-pick radius">
                  <Popover
                    content={
                      <div className="color-set">
                        {isShowColor && (
                          <ReactGPicker
                            value={xAxis.nameTextStyle.color}
                            format="hex"
                            onChange={colorPickHandle}
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
                      style={{ backgroundColor: xAxis.nameTextStyle.color }}
                    >
                      {xAxis.nameTextStyle.color || '#000'}
                    </div>
                  </Popover>
                </div>
              </SettingItem>
              <SettingItem name="大小">
                <InputNumber
                  value={xAxis.nameTextStyle.fontSize}
                  min={12}
                  onChange={(value) => handleInputChange(value, 'xAxis.nameTextStyle', 'fontSize')}
                  size="small"
                />
              </SettingItem>
              <SettingItem name="偏移量">
                <InputNumber
                  value={xAxis.nameGap}
                  min={5}
                  onChange={(value) => handleInputChange(value, 'xAxis', 'nameGap')}
                  size="small"
                />
              </SettingItem>
            </div>
          </SettingItemBox>
          <SettingItemBox name="标签">
            <div slot="default">
              <SettingItem name="展示">
                <Space>
                  <Switch
                    checked={xAxis.axisLabel.show}
                    size="small"
                    onChange={(value) => handleInputChange(value, 'xAxis.axisLabel', 'show')}
                  />
                </Space>
              </SettingItem>
              <SettingItem name="颜色">
                <div className="color-pick radius">
                  <Popover
                    content={
                      <div className="color-set">
                        {isShowColor && (
                          <ReactGPicker
                            value={xAxis.axisLabel.color}
                            format="hex"
                            onChange={colorPickHandle}
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
                      style={{ backgroundColor: xAxis.axisLabel.color }}
                    >
                      {xAxis.axisLabel.color || '#000'}
                    </div>
                  </Popover>
                </div>
              </SettingItem>
              <SettingItem name="大小">
                <InputNumber
                  value={xAxis.axisLabel.fontSize}
                  min={8}
                  onChange={(value) => handleInputChange(value, 'xAxis.axisLabel', 'fontSize')}
                  size="small"
                />
              </SettingItem>
              <SettingItem name="偏移量">
                <InputNumber
                  value={xAxis.axisLabel.rotate}
                  min={-90}
                  max={90}
                  onChange={(value) => handleInputChange(value, 'xAxis.axisLabel', 'rotate')}
                  size="small"
                />
              </SettingItem>
            </div>
          </SettingItemBox>
          <SettingItemBox name="轴线">
            <div slot="default">
              <SettingItem name="展示">
                <Space>
                  <Switch
                    checked={xAxis.axisLine.show}
                    size="small"
                    onChange={(value) => handleInputChange(value, 'xAxis.axisLine', 'show')}
                  />
                </Space>
              </SettingItem>
              <SettingItem name="颜色">
                <div className="color-pick radius">
                  <Popover
                    content={
                      <div className="color-set">
                        {isShowColor && (
                          <ReactGPicker
                            value={xAxis.axisLine.lineStyle.color}
                            format="hex"
                            onChange={colorPickHandle}
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
                      style={{ backgroundColor: xAxis.axisLine.lineStyle.color }}
                    >
                      {xAxis.axisLine.lineStyle.color || '#000'}
                    </div>
                  </Popover>
                </div>
              </SettingItem>
              <SettingItem name="粗细">
                <InputNumber
                  value={xAxis.axisLine.lineStyle.width}
                  min={1}
                  onChange={(value) => handleInputChange(value, 'xAxis.axisLabel', 'fontSize')}
                  size="small"
                />
              </SettingItem>
              <SettingItem name="位置">
                <Select
                  size="small"
                  className="color-select"
                  style={{ width: '263px' }}
                  value={xAxis.position}
                  onChange={(value) => handleInputChange(value, 'axisConfig', 'xposition')}
                  options={axisConfig.xposition}
                  popupClassName="select-option"
                />
              </SettingItem>
              <SettingItem name="对齐零">
                <Space>
                  <Switch
                    checked={xAxis.axisLine.onZero}
                    size="small"
                    onChange={(value) => handleInputChange(value, 'xAxis.axisLine', 'onZero')}
                  />
                </Space>
              </SettingItem>
              <SettingItem name="反向">
                <Space>
                  <Switch
                    checked={xAxis.inverse}
                    size="small"
                    onChange={(value) => handleInputChange(value, 'xAxis', 'inverse')}
                  />
                </Space>
              </SettingItem>
            </div>
          </SettingItemBox>
          <SettingItemBox name="刻度">
            <SettingItem name="展示">
              <Space>
                <Switch
                  checked={xAxis.axisTick.show}
                  size="small"
                  onChange={(value) => handleInputChange(value, 'xAxis.axisTick', 'show')}
                />
              </Space>
            </SettingItem>
            <SettingItem name="长度">
              <InputNumber
                value={xAxis.axisTick.length}
                min={1}
                onChange={(value) => handleInputChange(value, 'xAxis.axisTick', 'length')}
                size="small"
              />
            </SettingItem>
          </SettingItemBox>
          <SettingItemBox name="分割线">
            <div slot="default">
              <SettingItem name="展示">
                <Space>
                  <Switch
                    checked={xAxis.splitLine.show}
                    size="small"
                    onChange={(value) => handleInputChange(value, 'xAxis.splitLine', 'show')}
                  />
                </Space>
              </SettingItem>
              <SettingItem name="颜色">
                <div className="color-pick radius">
                  <Popover
                    content={
                      <div className="color-set">
                        {isShowColor && (
                          <ReactGPicker
                            value={xAxis.splitLine.lineStyle.color}
                            format="hex"
                            onChange={colorPickHandle}
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
                      style={{ backgroundColor: xAxis.splitLine.lineStyle.color }}
                    >
                      {xAxis.splitLine.lineStyle.color || '#000'}
                    </div>
                  </Popover>
                </div>
              </SettingItem>
              <SettingItem name="大小">
                <InputNumber
                  value={xAxis.axisLabel.fontSize}
                  min={8}
                  onChange={(value) => handleInputChange(value, 'xAxis.axisLabel', 'fontSize')}
                  size="small"
                />
              </SettingItem>
              <SettingItem name="粗细">
                <InputNumber
                  value={xAxis.splitLine.lineStyle.width}
                  min={-90}
                  max={90}
                  onChange={(value) =>
                    handleInputChange(value, 'xAxis.splitLine.lineStyle', 'width')
                  }
                  size="small"
                />
              </SettingItem>
              <SettingItem name="类型">
                <Select
                  size="small"
                  className="color-select"
                  style={{ width: '263px' }}
                  value={xAxis.splitLine.lineStyle.type}
                  onChange={(value) =>
                    handleInputChange(value, 'axisConfig.splitLint.lineStyle', 'type')
                  }
                  options={axisConfig.splitLint.lineStyle.type}
                  popupClassName="select-option"
                />
              </SettingItem>
            </div>
          </SettingItemBox>
        </CollapseItem>
      )}

      {yAxis && (
        <CollapseItem name="y轴" extraNode={() => genExtra(yAxis.show)}>
          <SettingItemBox name="单位">
            <div slot="default">
              <SettingItem name="名称">
                <Input
                  value={yAxis.name}
                  onChange={(value) => handleInputChange(value, 'yAxis', 'name')}
                  size="small"
                />
              </SettingItem>
              <SettingItem name="颜色">
                <div className="color-pick radius">
                  <Popover
                    content={
                      <div className="color-set">
                        {isShowColor && (
                          <ReactGPicker
                            value={yAxis.nameTextStyle.color}
                            format="hex"
                            onChange={colorPickHandle}
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
                      style={{ backgroundColor: yAxis.nameTextStyle.color }}
                    >
                      {yAxis.nameTextStyle.color || '#000'}
                    </div>
                  </Popover>
                </div>
              </SettingItem>
              <SettingItem name="大小">
                <InputNumber
                  value={yAxis.nameTextStyle.fontSize}
                  min={8}
                  onChange={(value) => handleInputChange(value, 'yAxis.nameTextStyle', 'fontSize')}
                  size="small"
                />
              </SettingItem>
              <SettingItem name="偏移量">
                <InputNumber
                  value={yAxis.nameGap}
                  min={5}
                  onChange={(value) => handleInputChange(value, 'yAxis', 'nameGap')}
                  size="small"
                />
              </SettingItem>
            </div>
          </SettingItemBox>
          <SettingItemBox name="标签">
            <div slot="default">
              <SettingItem name="展示">
                <Space>
                  <Switch
                    checked={yAxis.axisLabel.show}
                    size="small"
                    onChange={(value) => handleInputChange(value, 'yAxis.axisLabel', 'show')}
                  />
                </Space>
              </SettingItem>
              <SettingItem name="颜色">
                <div className="color-pick radius">
                  <Popover
                    content={
                      <div className="color-set">
                        {isShowColor && (
                          <ReactGPicker
                            value={yAxis.axisLabel.color}
                            format="hex"
                            onChange={colorPickHandle}
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
                      style={{ backgroundColor: yAxis.axisLabel.color }}
                    >
                      {yAxis.axisLabel.color || '#000'}
                    </div>
                  </Popover>
                </div>
              </SettingItem>
              <SettingItem name="大小">
                <InputNumber
                  value={yAxis.axisLabel.fontSize}
                  min={8}
                  onChange={(value) => handleInputChange(value, 'yAxis.axisLabel', 'fontSize')}
                  size="small"
                />
              </SettingItem>
              <SettingItem name="偏移量">
                <InputNumber
                  value={yAxis.axisLabel.rotate}
                  min={-90}
                  max={90}
                  onChange={(value) => handleInputChange(value, 'yAxis.axisLabel', 'rotate')}
                  size="small"
                />
              </SettingItem>
            </div>
          </SettingItemBox>
          <SettingItemBox name="轴线">
            <div slot="default">
              <SettingItem name="展示">
                <Space>
                  <Switch
                    checked={yAxis.axisLine.show}
                    size="small"
                    onChange={(value) => handleInputChange(value, 'yAxis.axisLine', 'show')}
                  />
                </Space>
              </SettingItem>
              <SettingItem name="颜色">
                <div className="color-pick radius">
                  <Popover
                    content={
                      <div className="color-set">
                        {isShowColor && (
                          <ReactGPicker
                            value={yAxis.axisLine.lineStyle.color}
                            format="hex"
                            onChange={colorPickHandle}
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
                      style={{ backgroundColor: yAxis.axisLine.lineStyle.color }}
                    >
                      {yAxis.axisLine.lineStyle.color || '#000'}
                    </div>
                  </Popover>
                </div>
              </SettingItem>
              <SettingItem name="粗细">
                <InputNumber
                  value={yAxis.axisLine.lineStyle.width}
                  min={1}
                  onChange={(value) => handleInputChange(value, 'yAxis.axisLabel', 'fontSize')}
                  size="small"
                />
              </SettingItem>
              <SettingItem name="位置">
                <Select
                  size="small"
                  className="color-select"
                  style={{ width: '263px' }}
                  value={yAxis.position}
                  onChange={(value) => handleInputChange(value, 'axisConfig', 'yposition')}
                  options={axisConfig.yposition}
                  popupClassName="select-option"
                />
              </SettingItem>
              <SettingItem name="对齐零">
                <Space>
                  <Switch
                    checked={yAxis.axisLine.onZero}
                    size="small"
                    onChange={(value) => handleInputChange(value, 'yAxis.axisLine', 'onZero')}
                  />
                </Space>
              </SettingItem>
              <SettingItem name="反向">
                <Space>
                  <Switch
                    checked={yAxis.inverse}
                    size="small"
                    onChange={(value) => handleInputChange(value, 'yAxis', 'inverse')}
                  />
                </Space>
              </SettingItem>
            </div>
          </SettingItemBox>
          <SettingItemBox name="刻度">
            <div slot="default">
              <SettingItem name="展示">
                <Space>
                  <Switch
                    checked={yAxis.axisTick.show}
                    size="small"
                    onChange={(value) => handleInputChange(value, 'yAxis.axisTick', 'show')}
                  />
                </Space>
              </SettingItem>
              <SettingItem name="长度">
                <InputNumber
                  value={yAxis.axisTick.length}
                  min={1}
                  onChange={(value) => handleInputChange(value, 'yAxis.axisTick', 'length')}
                  size="small"
                />
              </SettingItem>
            </div>
          </SettingItemBox>
          <SettingItemBox name="分割线">
            <div slot="default">
              <SettingItem name="展示">
                <Space>
                  <Switch
                    checked={yAxis.splitLine.show}
                    size="small"
                    onChange={(value) => handleInputChange(value, 'yAxis.splitLine', 'show')}
                  />
                </Space>
              </SettingItem>
              <SettingItem name="颜色">
                <div className="color-pick radius">
                  <Popover
                    content={
                      <div className="color-set">
                        {isShowColor && (
                          <ReactGPicker
                            value={yAxis.splitLine.lineStyle.color}
                            format="hex"
                            onChange={colorPickHandle}
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
                      style={{ backgroundColor: yAxis.splitLine.lineStyle.color }}
                    >
                      {yAxis.splitLine.lineStyle.color || '#000'}
                    </div>
                  </Popover>
                </div>
              </SettingItem>
              <SettingItem name="大小">
                <InputNumber
                  value={yAxis.axisLabel.fontSize}
                  min={8}
                  onChange={(value) => handleInputChange(value, 'yAxis.axisLabel', 'fontSize')}
                  size="small"
                />
              </SettingItem>
              <SettingItem name="粗细">
                <InputNumber
                  value={yAxis.splitLine.lineStyle.width}
                  min={-90}
                  max={90}
                  onChange={(value) =>
                    handleInputChange(value, 'yAxis.splitLine.lineStyle', 'width')
                  }
                  size="small"
                />
              </SettingItem>
              <SettingItem name="类型">
                <Select
                  size="small"
                  className="color-select"
                  style={{ width: '263px' }}
                  value={yAxis.splitLine.lineStyle.type}
                  onChange={(value) =>
                    handleInputChange(value, 'axisConfig.splitLint.lineStyle', 'type')
                  }
                  options={axisConfig.splitLint.lineStyle.type}
                  popupClassName="select-option"
                />
              </SettingItem>
            </div>
          </SettingItemBox>
        </CollapseItem>
      )}

      {legend && (
        <CollapseItem name="图例" extraNode={() => genExtra(legend.show)}>
          <SettingItemBox name="图例文字">
            <div slot="default">
              <SettingItem>
                <div className="color-pick radius">
                  <Popover
                    content={
                      <div className="color-set">
                        {isShowColor && (
                          <ReactGPicker
                            value={legend.textStyle.color}
                            format="hex"
                            onChange={colorPickHandle}
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
                      style={{ backgroundColor: legend.textStyle.color }}
                    >
                      {legend.textStyle.color || '#000'}
                    </div>
                  </Popover>
                </div>
              </SettingItem>
            </div>
          </SettingItemBox>
        </CollapseItem>
      )}

      {visualMap && (
        <>
          <CollapseItem name="视觉映射" extraNode={() => genExtra(visualMap.show)}>
            <SettingItemBox name="范围">
              <div slot="default">
                <SettingItem name="最小值">
                  <InputNumber
                    value={visualMap.min}
                    onChange={(value) => handleInputChange(value, 'visualMap', 'min')}
                    size="small"
                  />
                </SettingItem>
                <SettingItem name="最大值">
                  <InputNumber
                    value={visualMap.max}
                    onChange={(value) => handleInputChange(value, 'visualMap', 'max')}
                    size="small"
                  />
                </SettingItem>
              </div>
            </SettingItemBox>
            <SettingItemBox name="颜色">
              <div slot="default">
                {visualMap.inRange.color.map((item, index) => (
                  <SettingItem name={`层级-${index + 1}`} key={index}>
                    <div className="color-pick radius">
                      <Popover
                        content={
                          <div className="color-set">
                            {isShowColor && (
                              <ReactGPicker
                                value={visualMap.inRange.color[index]}
                                format="hex"
                                onChange={colorPickHandle}
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
                          style={{ backgroundColor: visualMap.inRange.color[index] }}
                        >
                          {visualMap.inRange.color[index] || '#000'}
                        </div>
                      </Popover>
                    </div>
                  </SettingItem>
                ))}
              </div>
            </SettingItemBox>
            <SettingItemBox name="控制块">
              <div slot="default">
                <SettingItem name="放置方向">
                  <Select
                    size="small"
                    className="color-select"
                    style={{ width: '263px' }}
                    value={visualMap.orient}
                    onChange={(value) => handleInputChange(value, 'axisConfig.visualMap', 'orient')}
                    options={axisConfig.visualMap.orient}
                    popupClassName="select-option"
                  />
                </SettingItem>
                <SettingItem name="宽度">
                  <InputNumber
                    value={visualMap.itemWidth}
                    min={5}
                    onChange={(value) => handleInputChange(value, 'visualMap', 'itemWidth')}
                    size="small"
                  />
                </SettingItem>
                <SettingItem name="高度">
                  <InputNumber
                    value={visualMap.itemHeight}
                    min={5}
                    onChange={(value) => handleInputChange(value, 'visualMap', 'itemHeight')}
                    size="small"
                  />
                </SettingItem>
                <SettingItem name="反转">
                  <Space>
                    <Switch
                      checked={visualMap.inverse}
                      size="small"
                      onChange={(value) => handleInputChange(value, 'visualMap', 'inverse')}
                    />
                  </Space>
                </SettingItem>
                <SettingItem name="拖拽组件实时更新">
                  <Space>
                    <Switch
                      checked={visualMap.realtime}
                      size="small"
                      onChange={(value) => handleInputChange(value, 'visualMap', 'realtime')}
                    />
                  </Space>
                </SettingItem>
              </div>
            </SettingItemBox>
            <SettingItemBox name="刻度">
              <div slot="default">
                <SettingItem name="展示">
                  <Space>
                    <Switch
                      checked={yAxis.axisTick.show}
                      size="small"
                      onChange={(value) => handleInputChange(value, 'yAxis.axisTick', 'show')}
                    />
                  </Space>
                </SettingItem>
                <SettingItem name="长度">
                  <InputNumber
                    value={yAxis.axisTick.length}
                    min={1}
                    onChange={(value) => handleInputChange(value, 'yAxis.axisTick', 'length')}
                    size="small"
                  />
                </SettingItem>
              </div>
            </SettingItemBox>
            <SettingItemBox name="分割线">
              <div slot="default">
                <SettingItem name="展示">
                  <Space>
                    <Switch
                      checked={yAxis.splitLine.show}
                      size="small"
                      onChange={(value) => handleInputChange(value, 'yAxis.splitLine', 'show')}
                    />
                  </Space>
                </SettingItem>
                <SettingItem name="颜色">
                  <div className="color-pick radius">
                    <Popover
                      content={
                        <div className="color-set">
                          {isShowColor && (
                            <ReactGPicker
                              value={yAxis.splitLine.lineStyle.color}
                              format="hex"
                              onChange={colorPickHandle}
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
                        style={{ backgroundColor: yAxis.splitLine.lineStyle.color }}
                      >
                        {yAxis.splitLine.lineStyle.color || '#000'}
                      </div>
                    </Popover>
                  </div>
                </SettingItem>
                <SettingItem name="大小">
                  <InputNumber
                    value={yAxis.axisLabel.fontSize}
                    min={8}
                    onChange={(value) => handleInputChange(value, 'yAxis.axisLabel', 'fontSize')}
                    size="small"
                  />
                </SettingItem>
                <SettingItem name="粗细">
                  <InputNumber
                    value={yAxis.splitLine.lineStyle.width}
                    min={-90}
                    max={90}
                    onChange={(value) =>
                      handleInputChange(value, 'yAxis.splitLine.lineStyle', 'width')
                    }
                    size="small"
                  />
                </SettingItem>
                <SettingItem name="类型">
                  <Select
                    size="small"
                    className="color-select"
                    style={{ width: '263px' }}
                    value={yAxis.splitLine.lineStyle.type}
                    onChange={(value) =>
                      handleInputChange(value, 'axisConfig.splitLint.lineStyle', 'type')
                    }
                    options={axisConfig.splitLint.lineStyle.type}
                    popupClassName="select-option"
                  />
                </SettingItem>
              </div>
            </SettingItemBox>
          </CollapseItem>
          <GlobalSettingPosition />
        </>
      )}
    </>
  );
};
export default GlobalSetting;
