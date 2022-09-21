import useTableUpdate from '@/hooks/useTableUpdate';
import { postThingsGroupInfoUpdate } from '@/services/iThingsapi/shebeifenzu';
import { FlagStatus } from '@/utils/base';
import { FORMITEM_LAYOUT, LAYOUT_TYPE_VERTICAL } from '@/utils/const';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ModalForm, ProFormGroup, ProFormList, ProFormText } from '@ant-design/pro-form';
import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import '../styles.less';
import type { GroupDescriptonProps, TagProps } from './types';

const GroupTags: React.FC<{
  flag: string;
  setTagValues?: React.Dispatch<
    React.SetStateAction<{
      tags: TagProps[];
    }>
  >;
  record?: GroupDescriptonProps;
}> = ({ flag, setTagValues, record }) => {
  const { updateHandler } = useTableUpdate();
  const [editFlag, setEditFlag] = useState(false);
  const [visible, setVisible] = useState(false);
  const editFormRef = useRef<ProFormInstance>();
  const tagFormRef = useRef<ProFormInstance>();

  type UpdateProp = typeof postThingsGroupInfoUpdate;

  const onOpen = () => setVisible(true);
  const onClose = () => setVisible(false);

  const formSubmit = async (values: { tags: TagProps[] }) => {
    const tagArr = values?.tags.map((item) => `${item.key}:${item.value}`);
    const tagStr = tagArr.join(';');
    onClose();
    const body = { ...(record as GroupDescriptonProps), tags: values?.tags };
    tagFormRef.current?.setFieldsValue({ tags: tagStr });
    if (flag === FlagStatus.CREATE)
      (
        setTagValues as React.Dispatch<
          React.SetStateAction<{
            tags: TagProps[];
          }>
        >
      )(values);
    else
      await updateHandler<UpdateProp, GroupDescriptonProps>(
        postThingsGroupInfoUpdate,
        undefined,
        body,
      );
  };
  useEffect(() => {
    editFormRef.current?.setFieldsValue(record?.tags);
  }, [editFlag, record]);

  return (
    <ModalForm<{ tags: TagProps[] }>
      formRef={editFormRef}
      width={650}
      title={flag === FlagStatus.CREATE ? '标签筛选' : '编辑标签'}
      trigger={
        flag === 'update' ? (
          <Button
            type="primary"
            onClick={() => {
              setEditFlag(true);
              onOpen();
            }}
          >
            编辑
          </Button>
        ) : (
          <ProForm
            formRef={tagFormRef}
            onClick={onOpen}
            submitter={{
              // 配置按钮的属性
              resetButtonProps: {
                style: {
                  // 隐藏重置按钮
                  display: 'none',
                },
              },
              submitButtonProps: {},
              // 完全自定义整个区域
              render: () => [],
            }}
          >
            <ProFormText
              className="tags"
              name="tags"
              placeholder="请选择分组标签"
              fieldProps={{
                suffix: <DownOutlined />,
                readOnly: true,
              }}
            />
          </ProForm>
        )
      }
      visible={visible}
      autoFocusFirstInput
      modalProps={{
        onCancel: onClose,
      }}
      submitTimeout={2000}
      {...FORMITEM_LAYOUT}
      layout={LAYOUT_TYPE_VERTICAL}
      onFinish={formSubmit}
    >
      <ProFormList
        name="tags"
        label="分组标签"
        initialValue={record?.tags}
        copyIconProps={false}
        creatorButtonProps={{
          type: 'link',
          icon: <PlusOutlined />,
          size: 'small',
          position: 'bottom',
          creatorButtonText: '新增标签',
        }}
      >
        <ProFormGroup key="group">
          <ProFormText
            name="key"
            placeholder="请输入标签key"
            rules={[
              {
                required: true,
                message: 'key值不可为空',
              },
            ]}
          />
          <ProFormText
            name="value"
            placeholder="请输入标签value"
            rules={[
              {
                required: true,
                message: 'value值不可为空',
              },
            ]}
          />
        </ProFormGroup>
      </ProFormList>
    </ModalForm>
  );
};

export default GroupTags;