/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-key */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/self-closing-comp */
import DynamicEngine from '@/components/DynamicEngine';
import { chartColors } from '@/settings/chartThemes';
import {
  animationsClass,
  getBlendModeStyle,
  getFilterStyle,
  getTransformStyle,
} from '@/utils/styles';
import { useMemo } from 'react';
import { useSelector } from 'umi';
import useDrag from '../hooks/useDrag';
import useStyle from '../hooks/useStyle';

import './styles.less';

const EditShapeBox: React.FC<{
  item: any;
  index: number;
}> = ({ item, index }) => {
  const {
    mousePointHandle,
    mouseClickHandle,
    mousedownHandle,
    mouseenterHandle,
    mouseleaveHandle,
  } = useDrag();

  const { useComponentStyle, useSizeStyle, setPointStyle } = useStyle();

  const { targetChart, editCanvasConfig } = useSelector((state) => state.chartEditStore);

  const sizeStyle = useSizeStyle(item.attr);

  const componentStyle = useComponentStyle(item.attr, index);

  // 锚点
  const pointList = ['t', 'r', 'b', 'l', 'lt', 'rt', 'lb', 'rb'];

  // 光标朝向
  const cursorResize = ['n', 'e', 's', 'w', 'nw', 'ne', 'sw', 'se'];

  // 兼容多值场景
  const select = useMemo(() => {
    const id = item.id;
    if (item.status.lock) return false;
    return targetChart.selectId.find((e: string) => e === id);
  }, []);

  // 计算当前选中目标
  const hover = useMemo(() => {
    if (item.status.lock) return false;
    return item.id === targetChart.hoverId;
  }, []);

  return (
    <div
      className={`ithings-shape-box shape-box-mouseEvent ${item.status.lock ? 'lock' : ''} ${
        item.status.hide ? 'hide' : ''
      }`}
      style={{
        ...componentStyle,
        ...(getBlendModeStyle(item.styles) as any),
      }}
      data-id={item.id}
      key={item.id}
      onClick={(e) => mouseClickHandle(e, item)}
      onMouseDown={(e) => mousedownHandle(e, item)}
      onMouseEnter={(e) => mouseenterHandle(e, item)}
      onMouseLeave={(e) => mouseleaveHandle(e, item)}
    >
      <div
        className={`edit-content-chart ${animationsClass(item.styles.animations)}`}
        style={{
          ...useSizeStyle(item.attr),
          ...getFilterStyle(item.styles),
          ...getTransformStyle(item.styles),
        }}
      >
        <DynamicEngine
          chartKey={item?.chartConfig?.chartKey}
          category={item?.chartConfig?.category}
          type={item?.chartConfig?.package}
          themeColor={chartColors[editCanvasConfig?.chartThemeColor]}
          themeSetting={editCanvasConfig?.chartThemeSetting}
          chartConfig={item}
        />
      </div>
      {/* 锚点 */}
      {select &&
        pointList.map((point, index) => (
          <div
            className={`shape-point  ${point}`}
            style={setPointStyle(point, index, item.attr, cursorResize)}
            onMouseDown={(e: MouseEvent) => mousePointHandle(e, point, item.attr)}
          ></div>
        ))}
      {/* 选中 */}
      <div className="shape-modal" style={{ ...sizeStyle }}>
        <div className={`shape-modal-select ${select ? 'active' : ''}`}></div>
        <div
          className={`shape-modal-change ${select ? 'selectActive' : ''} ${
            hover ? 'hoverActive' : ''
          }`}
        ></div>
      </div>
    </div>
  );
};
export default EditShapeBox;
