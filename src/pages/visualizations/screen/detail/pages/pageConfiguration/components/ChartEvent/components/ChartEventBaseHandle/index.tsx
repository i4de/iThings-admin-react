import MonacoEditor from '@/components/MonacoEditor';
import ScrollBar from '@/components/ScrollBar';
import { BaseEvent } from '@/packages/index.d';
import { useTargetData } from '@/pages/visualizations/screen/detail/pages/pageConfiguration/hooks/useTargetData';
import { EditOutlined, FileTextOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, Layout, message, Modal, Space, Tabs, Tag, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ValidationResult from '../ValidationResult';

const { Panel } = Collapse;
const { Content, Sider } = Layout;
const { Text } = Typography;

// 渲染tabItem项
const renderTableItem = (item) => {
  return {
    label: (
      <div className="tabs-label n-text">
        {item?.icon}
        {item.title}
      </div>
    ),
    key: item?.key,
    children: item.children,
  };
};

// 变量说明
const VariableDescription = () => {
  return (
    <ScrollBar>
      <Collapse className="ithings-px-3" defaultActiveKey={['1', '2']}>
        <Panel key={'1'} header={'mouseEvent'}>
          <Text>鼠标事件对象</Text>
        </Panel>
      </Collapse>
    </ScrollBar>
  );
};
const ChartEventBaseHandle: React.FC = () => {
  const { selectTarget } = useTargetData();

  const [showModal, setShowModal] = useState(false);

  // events 函数模板
  const baseEventRef = useRef({ ...selectTarget?.events.baseEvent });
  // 事件错误标识
  const errorFlagRef = useRef(false);

  // 验证语法
  const validEvents = () => {
    const validEventsObj = [
      {
        key: '1',
        title: '错误函数',
        msg: '',
      },
      {
        key: '2',
        title: '错误信息',
        msg: '',
      },
      {
        key: '3',
        title: '堆栈信息',
        msg: '',
      },
    ];

    // eslint-disable-next-line no-param-reassign
    errorFlagRef.current = Object.entries(baseEventRef.current).every(([eventName, str]) => {
      try {
        // 支持await，验证语法
        const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
        new AsyncFunction(str);
        return true;
      } catch (error: any) {
        validEventsObj[0].msg = error.message;
        validEventsObj[1].msg = error.name;
        validEventsObj[2].msg = eventName;
        return false;
      }
    });
    return {
      validEventsObj,
    };
  };

  const EventTypeName = {
    [BaseEvent.ON_CLICK]: '单击',
    [BaseEvent.ON_DBL_CLICK]: '双击',
    [BaseEvent.ON_MOUSE_ENTER]: '鼠标进入',
    [BaseEvent.ON_MOUSE_LEAVE]: '鼠标移出',
  };

  const baseEventSiderTabList = [
    {
      key: '1',
      title: '验证结果',
      children: <ValidationResult validEvents={validEvents} />,
    },
    {
      key: '2',
      title: '变量说明',
      children: <VariableDescription />,
    },
  ];

  const baseEventContentTabList = baseEventRef.current.map((eventName) => ({
    key: eventName,
    title: `${EventTypeName[eventName]}-${eventName}`,
    children: (
      <>
        {/*函数主体*/}
        <p className="ithings-pl-3">
          <span className="func-keyword">async function &nbsp;&nbsp;</span>
          <span className="func-keyNameWord">{`${eventName}(mouseEvent) & nbsp;&nbsp;{`}</span>
        </p>
        {/*编辑主体*/}
        <MonacoEditor
          height={'480px'}
          value={baseEventRef.current[eventName]}
          language={'javascript'}
        />
        {/*函数结束*/}
        <p className="ithings-pl-3 func-keyNameWord">{`}`}</p>
      </>
    ),
  }));

  const baseEventSiderTab = baseEventSiderTabList.map(renderTableItem);
  const baseEventContentTab = baseEventContentTabList.map(renderTableItem);

  const onShow = () => setShowModal(true);
  const closeShow = () => setShowModal(false);

  // 新增事件
  const saveEvents = () => {
    if (validEvents()?.[2]?.msg) {
      message.error('事件函数错误，无法进行保存');
      return;
    }
    if (Object.values(baseEventRef.current).join('').trim() === '') {
      // 清空事件
      selectTarget.events.baseEvent = {
        [BaseEvent.ON_CLICK]: undefined,
        [BaseEvent.ON_DBL_CLICK]: undefined,
        [BaseEvent.ON_MOUSE_ENTER]: undefined,
        [BaseEvent.ON_MOUSE_LEAVE]: undefined,
      };
    } else {
      selectTarget.events.baseEvent = { ...baseEventRef.current };
    }
    closeShow();
  };

  useEffect(() => {
    if (showModal) baseEventRef.current = { ...selectTarget.value.events.baseEvent };
  }, [showModal]);

  // TODO: 封装一个code组件，仅仅用来展示code

  return (
    <>
      <Panel
        header="基础事件配置"
        key="1"
        extra={
          <Button icon={<EditOutlined />} size="small" type="primary" onClick={onShow}>
            编辑
          </Button>
        }
      />
      <Card className="collapse-show-box">
        {/*函数体*/}
        {Object.keys(BaseEvent).map((eventName) => (
          <div key={eventName}>
            <p>
              <span className="func-annotate">{`// ${EventTypeName[eventName]}`}</span>
              <br />
              <span className="func-keyword">async {eventName}</span>
              {`(mouseEvent) {`}
            </p>
            <p className="ithings-ml-4">
              <MonacoEditor
                height="10vh"
                language="typescript"
                value={(selectTarget?.events?.baseEvent || {})[eventName] || ''}
              />
            </p>
            <p>
              {`}`}
              <span>,</span>
            </p>
          </div>
        ))}
      </Card>
      {/*弹窗*/}
      <Modal className="ithings-chart-data-monaco-editor" open={showModal}>
        <Card
          bordered={false}
          size="small"
          style={{ width: '1200px', height: '700px' }}
          title="基础事件编辑器"
          actions={[
            <div>
              <Tag icon={<FileTextOutlined />}>说明</Tag>
              <Text className="ithings-ml-2">编写方式同正常 JavaScript 写法</Text>
            </div>,
            <Space>
              <Button onClick={closeShow}>取消</Button>
              <Button type="primary" onClick={saveEvents}>
                保存
              </Button>
            </Space>,
          ]}
        >
          <Layout hasSider>
            <Content style={{ height: '580px', paddingRight: '20px' }}>
              <Tabs
                size="small"
                centered
                animated
                items={baseEventContentTab}
                type="card"
                style={{ minHeight: '100px' }}
                tabBarExtraContent={{
                  right: <Text type="warning">提示: ECharts 组件会拦截鼠标事件</Text>,
                }}
              />
            </Content>
            <Sider
              width={340}
              collapsedWidth={50}
              collapsible
              style={{ padding: '12px 12px 0px 12px', marginLeft: '3px' }}
            >
              <Tabs size="small" centered animated items={baseEventSiderTab} />
            </Sider>
          </Layout>
        </Card>
      </Modal>
    </>
  );
};
export default ChartEventBaseHandle;
