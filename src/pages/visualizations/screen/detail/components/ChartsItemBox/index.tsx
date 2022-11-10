import { EditCanvasTypeEnum } from '@/models/chartEditStore/chartEditStore';
import type { ConfigType } from '@/packages/index.d';
import '@/styles/scrollStyle.less';
import { CSSProperties, memo, useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'umi';

import './index.less';

const ChartsItemBox: React.FC<{
  menuOptionsItem: ConfigType;
}> = ({ menuOptionsItem }) => {
  const setEditCanvasDispatch = useDispatch();

  const [{ isDragging }, drag] = useDrag({
    item: { ...menuOptionsItem, type: menuOptionsItem?.key },
    begin: () => {
      setEditCanvasDispatch({
        type: 'chartEditStore/setEditCanvas',
        payload: {
          [EditCanvasTypeEnum.IS_CREATE]: true,
        },
      });
    },
    end: () => {
      setEditCanvasDispatch({
        type: 'chartEditStore/setEditCanvas',
        payload: {
          [EditCanvasTypeEnum.IS_CREATE]: false,
        },
      });
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const containerStyle: CSSProperties = useMemo(
    () => ({
      opacity: isDragging ? 0.4 : 1,
      cursor: 'move',
    }),
    [isDragging],
  );

  return (
    <div className="charts-item-box">
      <div className="charts-item-box-header">
        <div>123</div>
        <div>{menuOptionsItem?.title}</div>
      </div>
      <div className="charts-item-box-img" ref={drag} style={{ ...containerStyle }}>
        <img src={menuOptionsItem.image} />
      </div>
    </div>
  );
};

export default memo(ChartsItemBox);
