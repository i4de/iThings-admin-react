// import SketchBoard from 'mb-sketch-ruler';
import DynamicEngine from '@/components/DynamicEngine';
import { chartColors } from '@/settings/chartThemes';
import SketchBoard from 'ray-sketch-board';
import { useSelector } from 'umi';
import useDrag from './hooks/useDrag';

const ContentEdit: React.FC<{ itemBoxOptions: any; allType: any }> = (
  {
    // itemBoxOptions,
    // allType,
  },
) => {
  const { mousedownHandleUnStop, dragHandle, dragoverHandle } = useDrag();
  const { componentList, editCanvasConfig } = useSelector((state) => state.chartEditStore);

  return (
    <>
      <div
        style={{ position: 'relative' }}
        draggable
        onMouseDown={mousedownHandleUnStop}
        onDrop={dragHandle}
        onDragOver={dragoverHandle}
        onDragEnter={dragoverHandle}
      >
        <div style={{ backgroundColor: '#18181c' }}>
          <div
            style={{
              borderRadius: '10px',
              margin: '0 25px',
              overflow: 'hidden',
              boxShadow: ' 0 8px 10px rgb(30 30 30 / 12%)',
            }}
          >
            <div
              style={{
                margin: '25px 0',
                width: '1920px',
                height: '1080px',
                transform: 'scale(0.7)',
                backgroundColor: '#232324',
                borderColor: '#373739',
                transition: ' all 0.4s',
                position: 'relative',
                transformOrigin: 'left top',
                backgroundSize: 'cover',
              }}
            >
              {/* {componentList.map((v) => ( */}
              {/* <DynamicEngine {...v.chartConfig} isTpl={false} type={v.package} /> */}
              <DynamicEngine
                chartKey={'VBarCommon'}
                category={'Bars'}
                type={'Charts'}
                themeColor={chartColors[editCanvasConfig?.chartThemeColor]}
                themeSetting={editCanvasConfig?.chartThemeSetting}
                chartConfig={componentList[0]}
              />
              {/* ))} */}
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', top: '0' }}>
          <SketchBoard
            thick={20}
            scale={0.5}
            width={1000}
            height={700}
            startX={-10}
            startY={-10}
            rulerOption={{
              bgColor: '#18181c',
              longfgColor: '#7f7f81',
              fontColor: '#7f7f81',
              shortfgColor: '#7f7f81',
            }}
          />
        </div>
      </div>
    </>
  );
};
export default ContentEdit;
