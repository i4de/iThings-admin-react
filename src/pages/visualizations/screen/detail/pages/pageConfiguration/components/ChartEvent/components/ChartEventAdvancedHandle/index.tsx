import MonacoEditor from '@/components/MonacoEditor';
import ScrollBar from '@/components/ScrollBar';
import { npmPkgs } from '@/hooks/useLifeHandle';
import { BaseEvent, EventLife } from '@/packages/index.d';
import { useTargetData } from '@/pages/visualizations/screen/detail/pages/pageConfiguration/hooks/useTargetData';
import { EditOutlined, FileTextOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, Layout, message, Modal, Space, Tabs, Tag, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ValidationResult from '../ValidationResult';
import { templateList } from './importTemplate';

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
      <Collapse className="ithings-px-3" defaultActiveKey={['1', '2', '3', '4']}>
        <Panel key={'1'} header={'e'}>
          <Text>触发对应生命周期事件时接收的参数</Text>
        </Panel>
        <Panel key={'2'} header={'this'}>
          <Text>图表组件实例</Text>
          {['refs', 'setupState', 'ctx', 'props', '...'].map((prop) => (
            <Tag className="ithings-m-l" key={prop}>
              {prop}
            </Tag>
          ))}
        </Panel>
        <Panel key={'3'} header={'components'}>
          <Text>当前大屏内所有组件的集合id 图表组件中的配置id，可以获取其他图表组件进行控制</Text>
          <MonacoEditor height={'50vh'} value={`{\n  [id]: component\n}`} language={'typescript'} />
        </Panel>
        <Panel key={'4'} header={'node_modules'}>
          <Text>以下是内置在代码环境中可用的包变量</Text>
          {Object.keys(npmPkgs || {}).map((pkg) => (
            <Tag className="ithings-m-l" key={pkg}>
              {pkg}
            </Tag>
          ))}
        </Panel>
      </Collapse>
    </ScrollBar>
  );
};
// 介绍案例
const IntroduceTheCase = () => {
  return (
    <ScrollBar>
      <Collapse className="ithings-px-3" defaultActiveKey={['1', '2', '3', '4']}>
        {templateList.map((item, index) => (
          <Panel key={index} header={`案例${index + 1}：${item.description}`}>
            <MonacoEditor height={'50vh'} value={item.code} language={'typescript'} />
          </Panel>
        ))}
      </Collapse>
    </ScrollBar>
  );
};

const ChartEventAdvancedHandle: React.FC = () => {
  const { selectTarget } = useTargetData();

  const [showModal, setShowModal] = useState(false);

  // events 函数模板
  const advancedEventsRef = useRef({ ...selectTarget?.events.advancedEvents });
  // 事件错误标识
  const errorFlagRef = useRef(false);
  // 编辑区域控制
  const editTabRef = useRef(EventLife.VNODE_MOUNTED);

  const onShow = () => setShowModal(true);
  const closeShow = () => setShowModal(false);

  const EventLifeName = {
    [EventLife.VNODE_BEFORE_MOUNT]: '渲染之前',
    [EventLife.VNODE_MOUNTED]: '渲染之后',
  };

  const EventLifeTip = {
    [EventLife.VNODE_BEFORE_MOUNT]: '此时组件 DOM 还未存在',
    [EventLife.VNODE_MOUNTED]: '此时组件 DOM 已经存在',
  };

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
    errorFlagRef.current = Object.entries(advancedEventsRef.current).every(([eventName, str]) => {
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

  // 新增事件
  const saveEvents = () => {
    if (validEvents()?.[2]?.msg) {
      message.error('事件函数错误，无法进行保存');
      return;
    }
    if (Object.values(advancedEventsRef.current).join('').trim() === '') {
      // 清空事件
      selectTarget.events.baseEvent = {
        [BaseEvent.ON_CLICK]: undefined,
        [BaseEvent.ON_DBL_CLICK]: undefined,
        [BaseEvent.ON_MOUSE_ENTER]: undefined,
        [BaseEvent.ON_MOUSE_LEAVE]: undefined,
      };
    } else {
      selectTarget.events.baseEvent = { ...advancedEventsRef.current };
    }
    closeShow();
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
    {
      key: '3',
      title: '介绍案例',
      children: <IntroduceTheCase />,
    },
  ];
  const baseEventContentTabList = Object.keys(EventLife).map((eventName) => ({
    key: eventName,
    title: `${EventLifeName[eventName]}-${eventName}`,
    children: (
      <>
        {/*函数名称*/}
        <p className="ithings-pl-3">
          <span className="func-keyword">async function &nbsp;&nbsp;</span>
          <span className="func-keyNameWord">{`${eventName}(e, components, echarts, node_modules)&nbsp;&nbsp;`}</span>
        </p>
        {/*编辑主体*/}
        <MonacoEditor
          height={'480px'}
          value={advancedEventsRef.current[eventName]}
          language={'javascript'}
        />
        {/*函数结束*/}
        <p className="ithings-pl-3 func-keyNameWord">{`}`}</p>
      </>
    ),
  }));

  const baseEventSiderTab = baseEventSiderTabList.map(renderTableItem);
  const baseEventContentTab = baseEventContentTabList.map(renderTableItem);

  useEffect(() => {
    if (showModal) advancedEventsRef.current = { ...selectTarget.value.events.advancedEvents };
  }, [showModal]);

  return (
    <>
      <Panel
        header="高级事件配置"
        key="2"
        extra={
          <Button icon={<EditOutlined />} size="small" type="primary" onClick={onShow}>
            编辑
          </Button>
        }
      />
      <Card className="collapse-show-box">
        {/*函数体*/}
        {Object.keys(EventLife).map((eventName) => (
          <div key={eventName}>
            <p>
              <span className="func-annotate">{`// ${EventLifeName[eventName]}`}</span>
              <br />
              <span className="func-keyword">async {eventName}</span>{' '}
              {`(e, components, echarts, node_modules) {`}
            </p>
            <p className="ithings-ml-4">
              <MonacoEditor
                height="10vh"
                language="typescript"
                value={(selectTarget?.events?.advancedEvents || {})[eventName] || ''}
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
          title="高级事件编辑器（配合源码使用）"
          actions={[
            <div key="d">
              <Tag icon={<FileTextOutlined />}>说明</Tag>
              <Text className="ithings-ml-2">
                通过提供的参数可为图表增加定制化的tooltip、交互事件等等
              </Text>
            </div>,
            <Space key="s">
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
                  right: <Text type="warning">提示: {EventLifeTip[editTabRef.current]}</Text>,
                }}
              />
            </Content>
            <Sider
              width={340}
              collapsedWidth={50}
              collapsible
              style={{ padding: '12px 12px 0px 12px', marginLeft: '3px' }}
            >
              <Tabs size="small" centered animated items={baseEventSiderTab} type="card" />
            </Sider>
          </Layout>
        </Card>
      </Modal>
    </>
  );
};
export default ChartEventAdvancedHandle;
