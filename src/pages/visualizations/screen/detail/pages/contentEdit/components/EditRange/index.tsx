import { getFilterStyle } from '@/utils/styles';
import { useMemo } from 'react';
import { useSelector } from 'umi';
import useDrag from '../../hooks/useDrag';
import EditShapeBox from '../EditShapeBox';

import './styles.less';

const EditRange: React.FC = () => {
  const { mousedownBoxSelect } = useDrag();

  const { componentList, editCanvasConfig } = useSelector((state) => state.chartEditStore);

  console.log(componentList);

  // 背景
  const rangeStyle = useMemo(() => {
    // 设置背景色和图片背景
    const background = editCanvasConfig.background;
    const backgroundImage = editCanvasConfig.backgroundImage;
    const selectColor = editCanvasConfig.selectColor;
    const backgroundColor = background || undefined;

    const computedBackground = selectColor
      ? { background: backgroundColor }
      : { background: `url(${backgroundImage}) no-repeat center center / cover !important` };

    // @ts-ignore
    return {
      ...computedBackground,
      width: 'inherit',
      height: 'inherit',
    };
  }, [editCanvasConfig]);

  return (
    <div
      className="ithings-edit-range ithings-transition"
      style={{ height: '100%' }}
      onMouseDown={mousedownBoxSelect}
    >
      {/* 滤镜预览 */}
      <div style={{ ...rangeStyle, ...getFilterStyle(editCanvasConfig) }}>
        {componentList.length > 0 &&
          componentList.map((item, index) => <EditShapeBox item={item} index={index} key={item} />)}
      </div>
      {/* 水印 */}
      {/* 拖拽时的辅助线 */}
      {/* 框选时的样式框 */}
      {/* 拖拽时的遮罩 */}
    </div>
  );
};

export default EditRange;
