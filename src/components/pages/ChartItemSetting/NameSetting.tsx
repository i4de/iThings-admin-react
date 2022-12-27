import { useTargetData } from '@/pages/visualizations/screen/detail/pages/pageConfiguration/hooks/useTargetData';
import { Input, message } from 'antd';
import { useDispatch } from 'umi';
import SettingItemBox from './SettingItemBox';

const NameSetting: React.FC = () => {
  const setDispatch = useDispatch();

  const { selectTarget } = useTargetData();

  const handleBlur = () => {
    if (!selectTarget.chartConfig.title.length) {
      message.warning('请输入至少一个字符!');
    }
  };

  const handleChange = (e) => {
    setDispatch({
      type: 'chartEditStore/setChartConfig',
      payload: {
        key: 'title',
        value: e.target.value,
      },
    });
  };

  return (
    <SettingItemBox name="名称" alone={true}>
      <div slot="default">
        <Input
          maxLength={12}
          allowClear
          placeholder="请输入图表名称"
          size="small"
          showCount
          value={selectTarget.chartConfig.title}
          onBlur={handleBlur}
          onChange={handleChange}
          className="radius set-background-border"
        />
      </div>
    </SettingItemBox>
  );
};
export default NameSetting;
