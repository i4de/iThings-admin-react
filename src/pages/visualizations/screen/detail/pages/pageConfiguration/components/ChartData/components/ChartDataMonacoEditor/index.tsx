import MonacoEditor from '@/components/MonacoEditor';
import { ContainerOutlined, EditOutlined, FilterOutlined } from '@ant-design/icons';
import { Button, Card, Divider, message, Modal, Space, Tag, Typography } from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDispatch } from 'umi';
import { useTargetData } from '../../../../hooks/useTargetData';

const { Text } = Typography;

const ChartDataMonacoEditor: React.FC = () => {
  const setDispatch = useDispatch();
  const { selectTarget } = useTargetData();
  const [modal] = Modal.useModal();

  // filter 函数模板
  const filterRef = useRef(selectTarget?.filter || 'return data');
  // 目标静态/接口数据
  const sourceDataRef = useRef('');
  // 过滤错误标识
  const errorFlagRef = useRef(false);

  const [showModal, setShowModal] = useState(false);

  // 动态获取数据
  const fetchTargetData = async () => {
    try {
      // const res = await customizeHttp(
      //   toRaw(targetData.value.request),
      //   toRaw(chartEditStore.requestGlobalConfig),
      // );
      // if (res) {
      //   sourceData.value = res;
      //   return;
      // }
      message.warning('数据异常，请检查参数！');
    } catch (error) {
      message.warning('数据异常，请检查参数！');
    }
  };

  // 过滤结果
  const filterRes = useMemo(() => {
    try {
      const fn = new Function('data', 'res', filterRef.current);
      const response = cloneDeep(sourceDataRef.current);
      const res = fn(response?.data, response);
      errorFlagRef.current = false;
      return toString(res);
    } catch (error) {
      errorFlagRef.current = true;
      return '过滤函数错误';
    }
  }, []);

  //设置滚动条的样式
  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      width: '6px',
      backgroundColor: '#404043',
      borderRadius: '6px',
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} className="scroll-bar" />;
  };

  // 新增过滤器
  const addFilter = () => setShowModal(true);

  // 关闭过滤器
  const closeFilter = () => setShowModal(false);

  // 删除过滤器
  const delFilter = () => {
    // onPositiveCallback: () => {
    //   targetData.value.filter = undefined
    // }

    const config = {
      content: '是否删除过滤器',
      onOk: () => {
        setDispatch({
          type: 'chartEditStore/setChartOption',
          payload: {
            k: 'filter',
            v: undefined,
          },
        });
      },
    };
    modal.confirm(config);
  };

  // 保存过滤器
  const saveFilter = () => {
    if (errorFlagRef.current) {
      message.error('过滤函数错误，无法进行保存');
      return;
    }
    selectTarget.filter = filterRef.current;
    closeFilter();
  };

  useEffect(() => {
    if (showModal) fetchTargetData();
  }, [showModal]);

  return (
    <>
      {selectTarget?.filter ? (
        <Card>
          <p>
            <span className="func-keyword">function</span>
            {`filter(data, res) {`}
          </p>
          {/*函数体*/}
          <div className="ithings-ml-4">
            <MonacoEditor height="60vh" language="typescript" value={selectTarget?.filter} />
          </div>
          <p>{`}`}</p>
          <Space align="end">
            <Button size="small" onClick={addFilter} icon={<EditOutlined />}>
              编辑
            </Button>
            <Button size="small" onClick={delFilter} icon={<EditOutlined />}>
              删除
            </Button>
          </Space>
        </Card>
      ) : (
        <Button className="ithings-ml-3" onClick={addFilter} icon={<FilterOutlined />}>
          新增过滤器
        </Button>
      )}
      <Modal className="ithings-chart-data-monaco-editor" open={showModal}>
        <Card
          size="small"
          title={
            <Space>
              <Text>过滤函数编辑器</Text>
            </Space>
          }
          actions={[
            <div key="rule" className="go-flex-items-center">
              <Tag icon={<ContainerOutlined />}>规则</Tag>
              <Text className="ithings-ml-2">过滤器默认处理接口返回值的「data」字段</Text>
            </div>,
            <Space key="btn">
              <Button size="middle" onClick={closeFilter}>
                取消
              </Button>
              <Button size="middle" onClick={saveFilter}>
                保存
              </Button>
            </Space>,
          ]}
        >
          <Space size="small" direction="vertical">
            <Space>
              <div>
                <Space direction="vertical">
                  <Tag color="#2080f0">
                    <span className="func-keyword">function</span> {`filter(data, res) {`}
                  </Tag>
                  <MonacoEditor
                    height="380px"
                    width="460px"
                    language="javascript"
                    value={filterRef.current}
                  />
                  <Tag color="#2080f0">{`}`}</Tag>
                </Space>
              </div>
              <Divider style={{ height: '480px' }} />
              <Scrollbars renderThumbVertical={renderThumb}>
                <Space direction="vertical" style={{ maxHeight: '480px' }}>
                  <div className="editor-data-show">
                    <Space>
                      <Text>默认过滤数据(data)：</Text>
                      <MonacoEditor
                        height="50px"
                        language="json"
                        value={JSON.stringify(sourceDataRef.current?.data, null, 2) || '暂无'}
                      />
                    </Space>
                  </div>
                  <div className="editor-data-show">
                    <Space>
                      <Text>默认过滤数据(res)：</Text>
                      <MonacoEditor
                        height="50px"
                        language="json"
                        value={JSON.stringify(sourceDataRef.current, null, 2) || '暂无'}
                      />
                    </Space>
                  </div>
                  <div className="editor-data-show">
                    <Space>
                      <Text>过滤器结果：</Text>
                      <MonacoEditor
                        height="50px"
                        language="json"
                        value={JSON.stringify(filterRes, null, 2) || '暂无'}
                      />
                    </Space>
                  </div>
                </Space>
              </Scrollbars>
            </Space>
          </Space>
        </Card>
      </Modal>
    </>
  );
};
export default ChartDataMonacoEditor;
