import { DragKeyEnum } from '@/enums/editPageEnum';
import { EditCanvasTypeEnum } from '@/models/chartEditStore/chartEditStore';
import type { ConfigType } from '@/packages/index.d';
import '@/styles/scrollStyle.less';
import { memo } from 'react';
import { useDispatch } from 'umi';

import './index.less';

const ChartsItemBox: React.FC<{
  menuOptionsItem: ConfigType;
}> = ({ menuOptionsItem }) => {
  const setEditCanvasDispatch = useDispatch();

  const dragStartHandle = (e) => {
    // 将配置项绑定到拖拽属性上
    e!.dataTransfer!.setData(DragKeyEnum.DRAG_KEY, JSON.stringify(menuOptionsItem));
    setEditCanvasDispatch({
      type: 'chartEditStore/setEditCanvas',
      payload: {
        [EditCanvasTypeEnum.IS_CREATE]: true,
      },
    });
  };

  const dragendHandle = () => {
    setEditCanvasDispatch({
      type: 'chartEditStore/setEditCanvas',
      payload: {
        [EditCanvasTypeEnum.IS_CREATE]: false,
      },
    });
  };

  return (
    <div className="charts-item-box">
      <div className="charts-item-box-header">
        <div>123</div>
        <div>{menuOptionsItem?.title}</div>
      </div>
      <div className="charts-item-box-img" onDragStart={dragStartHandle} onDragEnd={dragendHandle}>
        <img src={menuOptionsItem.image} />
      </div>
    </div>
  );
};

export default memo(ChartsItemBox);
