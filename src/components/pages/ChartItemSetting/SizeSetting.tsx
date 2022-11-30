import { useTargetData } from '@/pages/visualizations/screen/detail/pages/pageConfiguration/hooks/useTargetData';
import { InputNumber } from 'antd';
import { useDispatch } from 'umi';
import SettingItemBox from './SettingItemBox';

const SizeSetting: React.FC = () => {
  const setDispatch = useDispatch();
  const { selectTarget } = useTargetData();

  const handleChange = (value, flag) => {
    setDispatch({
      type: 'chartEditStore/setChartAttr',
      payload: {
        key: flag,
        value,
      },
    });
  };

  return (
    <SettingItemBox name="尺寸">
      <InputNumber
        value={selectTarget?.attr.w}
        min={50}
        disabled={selectTarget?.isGroup}
        placeholder="px"
        size="small"
        prefix={'宽度'}
        onChange={(value) => handleChange(value, 'w')}
      />
      <InputNumber
        value={selectTarget?.attr.h}
        min={50}
        disabled={selectTarget?.isGroup}
        placeholder="px"
        size="small"
        prefix={'高度'}
        onChange={(value) => handleChange(value, 'h')}
      />
    </SettingItemBox>
  );
};
export default SizeSetting;
