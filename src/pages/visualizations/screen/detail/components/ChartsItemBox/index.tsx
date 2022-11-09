import type { ConfigType } from '@/packages/index.d';
import '@/styles/scrollStyle.less';
import './index.less';
const ChartsItemBox: React.FC<{
  menuOptions: ConfigType[];
}> = ({ menuOptions }) => {
  // 拖拽处理
  const dragStartHandle = () => {};
  // 拖拽结束
  const dragendHandle = () => {
    // chartEditStore.setEditCanvas(EditCanvasTypeEnum.IS_CREATE, false);
  };

  return (
    <div className="charts-box scroll-bar">
      {menuOptions.map((v, i) => (
        <div
          className="charts-item-box"
          key={i}
          draggable
          onDragStart={(e) => dragStartHandle(e, v)}
          onDragEnd={dragendHandle}
        >
          <div className="charts-item-box-header">
            <div>123</div>
            {/* <mac-os-control-btn :mini="true" :disabled="true"></mac-os-control-btn> */}
            <div>{v?.title}</div>
          </div>
          <div className="charts-item-box-img">
            <img src={v.image} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChartsItemBox;
