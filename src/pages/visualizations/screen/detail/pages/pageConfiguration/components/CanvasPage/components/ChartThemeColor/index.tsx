import { EditCanvasConfigEnum } from '@/models/chartEditStore/chartEditStore';
import type { ChartColorsNameType } from '@/settings/chartThemes';
import { chartColors, chartColorsName, chartColorsshow } from '@/settings/chartThemes';
import { Card, Typography } from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import { useDispatch, useSelector } from 'umi';

import './styles.less';

const { Text } = Typography;

const ChartThemeColor: React.FC = () => {
  const { editCanvasConfig } = useSelector((state) => state.chartEditStore);

  const setDispatch = useDispatch();

  // 设置主体色（在 ContentEdit > List 中进行注入）
  const selectTheme = (theme: ChartColorsNameType) => {
    setDispatch({
      type: 'chartEditStore/setEditCanvasConfig',
      payload: {
        k: EditCanvasConfigEnum.CHART_THEME_COLOR,
        v: theme,
      },
    });
  };

  // 获取用来展示的色号
  const fetchShowColors = (colors: string[]) => cloneDeep(colors).splice(0, 6);

  return (
    <div className={'ithings-chart-theme-color'}>
      {Object.keys(chartColors).map((key) => (
        <Card
          className={`card-box ${key === editCanvasConfig.chartThemeColor ? 'selected' : ''}`}
          size="small"
          key={key}
          hoverable
          onClick={() => selectTheme(key as ChartColorsNameType)}
        >
          <div className={'ithings-flex-items-center'}>
            <Text>{chartColorsName[key]}</Text>
            {fetchShowColors(chartColors[key].color).map((colorItem) => (
              <span
                className={'theme-color-item'}
                key={colorItem}
                style={{ backgroundColor: colorItem }}
              />
            ))}
          </div>
          <div className={'theme-bottom'} style={{ backgroundImage: chartColorsshow[key] }} />
        </Card>
      ))}
    </div>
  );
};
export default ChartThemeColor;
