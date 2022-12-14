import useGetSelectOptions from '@/hooks/useGetSelectOption';
import useTableCreate from '@/hooks/useTableCreate';
import useTableUpdate from '@/hooks/useTableUpdate';
import { postSystemRoleIndex } from '@/services/iThingsapi/jiaoseguanli';
import { postSystemUserCreate, postSystemUserUpdate } from '@/services/iThingsapi/yonghuguanli';
import { FORMITEM_LAYOUT, LAYOUT_TYPE_HORIZONTAL } from '@/utils/const';
import { PlusOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import type { ActionType } from '@ant-design/pro-table';
import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import type { UserListItem } from '../types';

// const { Option } = Select;
const CreateOrUpdateUser: React.FC<{
  flag: string;
  record?: UserListItem;
  actionRef: React.MutableRefObject<ActionType | undefined>;
}> = ({ flag, record, actionRef }) => {
  const { querySelectOptions, selectOptions } = useGetSelectOptions();

  const { createHandler } = useTableCreate();
  const { updateHandler } = useTableUpdate();
  const [editFlag, setEditFlag] = useState(false);
  const [visible, setVisible] = useState(false);
  // const [imageUrl, setImageUrl] = useState<string>();
  const editFormRef = useRef<ProFormInstance>();
  type CreateProp = typeof postSystemUserCreate;
  type UpdateProp = typeof postSystemUserUpdate;
  type QueryRoleProp = typeof postSystemRoleIndex;

  const ROLE_OPTION = selectOptions;

  const onOpen = () => setVisible(true);
  const onClose = () => setVisible(false);

  const formSubmit = async (values: UserListItem) => {
    const body = { ...values, reqType: 'pwd' };
    if (flag === 'update')
      await updateHandler<UpdateProp, UserListItem>(postSystemUserUpdate, actionRef, {
        ...body,
        uid: record?.uid as string,
      });
    else await createHandler<CreateProp, UserListItem>(postSystemUserCreate, actionRef, body);
    onClose();
    editFormRef.current?.resetFields();
  };

  useEffect(() => {
    editFormRef.current?.setFieldsValue(record);
  }, [editFlag, record]);

  useEffect(() => {
    querySelectOptions<QueryRoleProp>(postSystemRoleIndex, {
      page: { page: 1, size: 99999 },
      label: 'name',
      value: 'id',
    });
  }, []);
  return (
    <ModalForm<UserListItem>
      width={550}
      formRef={editFormRef}
      title={flag === 'update' ? '??????????????????' : '????????????'}
      trigger={
        <Button
          type="primary"
          onClick={() => {
            setEditFlag(true);
            onOpen();
          }}
        >
          {flag === 'update' ? (
            '??????'
          ) : (
            <>
              <PlusOutlined /> ????????????
            </>
          )}
        </Button>
      }
      visible={visible}
      autoFocusFirstInput
      modalProps={{
        onCancel: onClose,
      }}
      submitTimeout={2000}
      {...FORMITEM_LAYOUT}
      layout={LAYOUT_TYPE_HORIZONTAL}
      onFinish={formSubmit}
    >
      <ProFormText
        name="userName"
        width="md"
        label="?????????"
        placeholder="??????????????????"
        rules={[
          {
            required: true,
            pattern: /^[a-zA-Z][a-zA-Z0-9_-]{6,20}$/,
            message:
              '???????????????????????????????????????????????????????????????????????????????????????????????????????????? ?????????6???20?????????',
          },
        ]}
      />
      {flag === 'create' && (
        <ProFormText.Password
          name="password"
          width="md"
          label="??????"
          placeholder="???????????????"
          rules={[
            {
              required: true,
              pattern: /^.*(?=.{9,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?+-/,.??~|'" ]).*$/,
              message: '????????????????????????????????????+??????+???????????????9????????????',
            },
          ]}
        />
      )}
      <ProFormSelect
        width="md"
        name="role"
        label="????????????"
        rules={[
          {
            required: true,
            message: '???????????????????????????',
          },
        ]}
        request={async () => ROLE_OPTION}
      />
      <ProFormText name="nickName" width="md" label="??????" placeholder="???????????????" />
      {/* <ProFormSelect
        width="md"
        name="sex"
        label="??????"
        request={async () => [
          { label: '??????', value: 1 },
          { label: '??????', value: 2 },
        ]}
      />
      <ProFormText name="country" width="md" label="??????" placeholder="?????????????????????" />
      <ProFormText name="province" width="md" label="??????" placeholder="?????????????????????" />
      <ProFormText name="city" width="md" label="??????" placeholder="?????????????????????" />
      <ProFormText name="language" width="md" label="??????" placeholder="?????????????????????" /> */}
    </ModalForm>
  );
};

export default CreateOrUpdateUser;
