import MonacoEditor from '@/components/MonacoEditor';
import { RequestDataTypeEnum } from '@/enums/httpEnum';
import { ChartFrameEnum } from '@/packages/index.d';
import ChartDataMonacoEditor from '@/pages/visualizations/screen/detail/pages/pageConfiguration/components/ChartData/components/ChartDataMonacoEditor';
import { useTargetData } from '@/pages/visualizations/screen/detail/pages/pageConfiguration/hooks/useTargetData';
import { isArray } from '@/utils/type';
import { DownloadOutlined, FileAddOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Space, Timeline, Tooltip, Typography, Upload } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFile } from '../../hooks/useFile';
import { DataResultEnum, TimelineTitleEnum } from '../../index.d';

const { Text } = Typography;

type TableListItem = {
  key: number;
  name: string;
  containers: number;
  creator: string;
  status: string;
  createdAt: number;
  memo: string;
};

const ChartDataMatchingAndShow: React.FC<{
  ajax: boolean;
}> = ({ ajax }) => {
  const { selectTarget } = useTargetData();
  const { customRequest, beforeUpload } = useFile();

  const dimensions = useRef(null);
  const source = useRef(null);
  const noData = useRef(null);

  const [dimensionsAndSource, setDimensionsAndSource] = useState(null);

  // 是支持 dataset 的图表类型
  const isCharts = useMemo(() => {
    return selectTarget.chartConfig.chartFrame === ChartFrameEnum.ECHARTS;
  }, [selectTarget.chartConfig.chartFrame]);

  // 是否展示过滤器
  const filterShow = useMemo(() => {
    return selectTarget.request.requestDataType === RequestDataTypeEnum.AJAX;
  }, [selectTarget.request.requestDataType]);

  // 处理映射列表状态结果
  const matchingHandle = (mapping: string) => {
    let res = DataResultEnum.SUCCESS;
    for (let i = 0; i < source.current.length; i++) {
      if (source.current[i][mapping] === undefined) {
        res = DataResultEnum.FAILURE;
        return res;
      }
    }
    return DataResultEnum.SUCCESS;
  };

  // 处理映射列表
  const dimensionsAndSourceHandle = () => {
    try {
      // 去除首项数据轴标识
      return dimensions.current.map((dimensionsItem: string, index: number) => {
        return index === 0
          ? {
              // 字段
              field: '通用标识',
              // 映射
              mapping: dimensionsItem,
              // 结果
              status: DataResultEnum.NULL,
            }
          : {
              field: `数据项-${index}`,
              mapping: dimensionsItem,
              status: matchingHandle(dimensionsItem),
            };
      });
    } catch (error) {
      return [];
    }
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '字段',
      dataIndex: 'field',
    },
    {
      title: '映射',
      dataIndex: 'mapping',
    },
    {
      title: '状态',
      dataIndex: 'status',
      initialValue: '1',
      valueEnum: {
        0: { text: '无', status: 'Default' },
        1: { text: '匹配成功', status: 'Success' },
        2: { text: '匹配失败', status: 'Error' },
      },
    },
  ];

  useEffect(() => {
    if (
      selectTarget?.option?.dataset &&
      selectTarget?.chartConfig?.chartFrame === ChartFrameEnum.ECHARTS
    ) {
      // 只有 DataSet 数据才有对应的格式
      source.current = selectTarget?.option?.dataset;
      console.log(source.current);
      if (isCharts) {
        dimensions.current = selectTarget?.option?.dataset?.dimensions;
        setDimensionsAndSource(dimensionsAndSourceHandle());
      }
    } else if (
      selectTarget?.option?.dataset !== undefined &&
      selectTarget?.option?.dataset !== null
    ) {
      setDimensionsAndSource(null);
      source.current = selectTarget?.option?.dataset;
    } else {
      noData.current = true;
      source.current = '此组件无数据源';
    }
    if (isArray(selectTarget?.option?.dataset)) {
      setDimensionsAndSource(null);
    }
  }, [selectTarget?.option?.dataset]);
  return (
    <Timeline className="ithings-chart-configurations-timeline">
      {isCharts && dimensionsAndSource && (
        <Timeline.Item>
          <Text>{TimelineTitleEnum.MAPPING}</Text>
          <ProTable<TableListItem>
            dataSource={dimensionsAndSource}
            rowKey="field"
            pagination={false}
            columns={columns}
            search={false}
            toolBarRender={false}
          />
        </Timeline.Item>
      )}
      {filterShow && (
        <Timeline.Item color="#97846c">
          <Space direction="vertical">
            <Text>过滤器默认处理接口返回值的「data」字段</Text>
            <ChartDataMonacoEditor />
          </Space>
        </Timeline.Item>
      )}
      <Timeline.Item color="#18a058">
        <Text>{TimelineTitleEnum.CONTENT}</Text>
        <div>
          <Space direction="vertical">
            <Space className="source-btn-box">
              <Upload
                showUploadList={false}
                beforeUpload={beforeUpload}
                customRequest={customRequest}
              >
                <Space>
                  {!ajax && (
                    <Button
                      className="sourceBtn-item"
                      disabled={noData.current}
                      icon={<FileAddOutlined />}
                    >
                      导入（json / txt）
                    </Button>
                  )}
                </Space>
                <div>
                  <Button
                    className="sourceBtn-item"
                    disabled={noData.current}
                    icon={<DownloadOutlined />}
                  >
                    下载
                  </Button>
                  <Tooltip title="点击【下载】查看完整数据">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </div>
              </Upload>
            </Space>
          </Space>
        </div>
        <MonacoEditor
          height="60vh"
          language="json"
          value={JSON.stringify(source.current, null, 2)}
        />
      </Timeline.Item>
    </Timeline>
  );
};
export default ChartDataMatchingAndShow;
