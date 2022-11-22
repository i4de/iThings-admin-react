import { Space, Typography } from 'antd';

const { Text } = Typography;
const SettingItemBox: React.FC<{
  name?: string;
  alone?: boolean;
  itemRightStyle?: any;
}> = (props) => {
  const { name, alone, itemRightStyle, children } = props || {};

  const createSlot = (slotName: string) => {
    let childrenObj = children;
    if (typeof children === 'object' && !Array.isArray(children)) childrenObj = [children];
    if (childrenObj)
      for (const el of childrenObj) {
        if (el.props.slot === slotName) return el;
      }
    return null;
  };

  return (
    <div className="ithings-config-item-box">
      <Text className="item-left">
        {name}
        <Space size="middle">{createSlot('name')}</Space>
      </Text>
      <div
        className="item-right"
        style={{
          gridTemplateColumns: alone ? '1fr' : '1fr 1fr',
          ...itemRightStyle,
        }}
      >
        {createSlot('default') || children}
      </div>
    </div>
  );
};

export default SettingItemBox;
