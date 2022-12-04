import MonacoEditor from '@/components/MonacoEditor';
import { SettingItemBox } from '@/components/pages/ChartItemSetting';
import {
  RequestBodyEnum,
  RequestBodyEnumList,
  RequestContentTypeEnum,
  RequestHttpEnum,
  RequestParamsTypeEnum,
} from '@/enums/httpEnum';
import { useTargetData } from '@/pages/visualizations/screen/detail/pages/pageConfiguration/hooks/useTargetData';
import { Card, Radio, Space, Tabs, Tag, Typography } from 'antd';
import { useRef } from 'react';
import RequestHeaderTable from '../RequestHeaderTable';

const { Text } = Typography;
// 渲染tabItem项
const renderTableItem = (item) => {
  return {
    label: <div className="tabs-label n-text">{item.title}</div>,
    key: item?.key,
    children: item.children,
  };
};
// 选择body
const RequestParamsBodyType: React.FC<{ requestParamsBodyType: any; requestParams: any }> = ({
  requestParamsBodyType,
  requestParams,
}) => {
  return (
    <>
      <Radio.Group>
        <Space>
          {RequestBodyEnumList.map((bodyEnum) => (
            <Radio key={bodyEnum} value={bodyEnum}>
              {bodyEnum}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
      {/*为none时*/}
      {requestParamsBodyType === RequestBodyEnum.NONE && (
        <Card className="ithings-mt-3 go-pb-3">
          <Text>该请求没有 Body 体</Text>
        </Card>
      )}
      {/*具有对象属性时*/}
      {(requestParamsBodyType === RequestBodyEnum.FORM_DATA ||
        requestParamsBodyType === RequestBodyEnum.X_WWW_FORM_URLENCODED) && (
        <RequestHeaderTable
          className="ithings-mt-3"
          target={requestParams[RequestParamsTypeEnum.BODY][requestParamsBodyType]}
        />
      )}
      {/*json*/}
      {requestParamsBodyType === RequestBodyEnum.JSON && (
        <MonacoEditor
          value={requestParams[RequestParamsTypeEnum.BODY][requestParamsBodyType]}
          width="600px"
          height="200px"
          language="json"
        />
      )}
      {/*xml*/}
      {requestParamsBodyType === RequestBodyEnum.XML && (
        <MonacoEditor
          value={requestParams[RequestParamsTypeEnum.BODY][requestParamsBodyType]}
          width="600px"
          height="200px"
          language="html"
        />
      )}
    </>
  );
};
// 选择其他
const NotRequestParamsBodyType: React.FC<{ requestParams: any; tabValueRef: any }> = ({
  requestParams,
  tabValueRef,
}) => {
  return (
    <div className="ithings-mt-3">
      <RequestHeaderTable target={requestParams[tabValueRef]} />
    </div>
  );
};

const RequestContentTypeDefault: React.FC<{
  requestParamsBodyType: any;
  requestParams: any;
  tabValueRef: any;
}> = ({ requestParamsBodyType, requestParams, tabValueRef }) => {
  const requestDefaultTabList = [
    {
      key: RequestParamsTypeEnum.PARAMS,
      title: 'Params',
      children: (
        <NotRequestParamsBodyType requestParams={requestParams} tabValueRef={tabValueRef} />
      ),
    },
    {
      key: RequestParamsTypeEnum.BODY,
      title: 'Body',
      children: (
        <RequestParamsBodyType
          requestParamsBodyType={requestParamsBodyType}
          requestParams={requestParams}
        />
      ),
    },
    {
      key: RequestParamsTypeEnum.HEADER,
      title: 'Header',
      children: (
        <NotRequestParamsBodyType requestParams={requestParams} tabValueRef={tabValueRef} />
      ),
    },
  ];
  const requestDefaultTab = requestDefaultTabList.map(renderTableItem);
  return <Tabs type="line" size="small" centered animated items={requestDefaultTab} />;
};

const RequestContentTypeSQL: React.FC<{
  requestHttpType: any;
  requestSQLContent: any;
}> = ({ requestHttpType, requestSQLContent }) => {
  return (
    <>
      {requestHttpType === RequestHttpEnum.GET ? (
        <Text>SQL 类型不支持 Get 请求，请使用其它方式</Text>
      ) : (
        <>
          <Tag color="#f0a020">需要后台提供专门处理 sql 的接口</Tag>
          <SettingItemBox name="键名">
            <div slot="default">
              <Tag style={{ width: '40px', fontSize: '16px' }} color="#2080f0" />
            </div>
          </SettingItemBox>
          <SettingItemBox name="键值">
            <div slot="default">
              <MonacoEditor
                value={requestSQLContent.sql}
                width="600px"
                height="200px"
                language="sql"
              />
            </div>
          </SettingItemBox>
        </>
      )}
    </>
  );
};

const RequestHeader: React.FC = () => {
  const { selectTarget } = useTargetData();
  const tabValueRef = useRef<RequestParamsTypeEnum.PARAMS>(RequestParamsTypeEnum.PARAMS);

  const { requestHttpType, requestSQLContent, requestParams, requestParamsBodyType } =
    selectTarget?.request || {};
  const requestTabList = [
    {
      key: RequestContentTypeEnum.DEFAULT,
      title: '普通请求',
      children: (
        <RequestContentTypeDefault
          requestParamsBodyType={requestParamsBodyType}
          requestParams={requestParams}
          tabValueRef={tabValueRef.current}
        />
      ),
    },
    {
      key: RequestContentTypeEnum.SQL,
      title: 'SQL请求',
      children: (
        <RequestContentTypeSQL
          requestHttpType={requestHttpType}
          requestSQLContent={requestSQLContent}
        />
      ),
    },
  ];

  const requestTab = requestTabList.map(renderTableItem);
  return (
    <Space direction="vertical">
      <div style={{ width: '600px' }}>
        <Tabs size="small" centered animated items={requestTab} />
      </div>
    </Space>
  );
};
export default RequestHeader;
