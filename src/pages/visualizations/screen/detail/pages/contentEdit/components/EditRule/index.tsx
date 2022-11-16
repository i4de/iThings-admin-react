import SketchBoard from 'ray-sketch-board';
import { useSelector } from 'umi';

const EditRule: React.FC = () => {
  const { editCanvasConfig, editCanvas } = useSelector((state) => state.chartEditStore);

  const canvasBox = () => {
    const layoutDom = document.getElementById('ithings-chart-edit-layout');
    if (layoutDom) {
      return {
        height: layoutDom.clientHeight - 40,
        width: layoutDom.clientWidth,
      };
    }
    return {
      width: editCanvasConfig?.width,
      height: editCanvasConfig?.height,
    };
  };

  return (
    <SketchBoard
      thick={20}
      scale={editCanvas?.scale}
      width={canvasBox().width}
      height={canvasBox().height}
      startX={0}
      startY={0}
      rulerOption={{
        bgColor: '#18181c',
        longfgColor: '#7f7f81',
        fontColor: '#7f7f81',
        shortfgColor: '#7f7f81',
      }}
    />
  );
};

export default EditRule;
