import { Typography } from 'antd';

const { Text } = Typography;

const SettingItem: React.FC<{
  width?: number;
  name?: string;
}> = (props) => {
  const { width, name } = props;

  return (
    <div className="ithings-setting-item" style={{ width: `${width}px` }}>
      {props.children}
      <Text className="name">{name}</Text>
    </div>
  );
};

export default SettingItem;
