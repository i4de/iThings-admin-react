import type { ConfigType } from '@/packages/index.d';
import '@/styles/scrollStyle.less';
import { CSSProperties, memo, useMemo } from 'react';
import { useDrag } from 'react-dnd';

import './index.less';

const ChartsItemBox: React.FC<{
  menuOptionsItem: ConfigType;
}> = ({ menuOptionsItem }) => {
  const [{ isDragging }, drag] = useDrag({
    // type: menuOptionsItem?.key,
    item: { ...menuOptionsItem, type: menuOptionsItem?.key },
    begin: () => {
      console.log('start');
    },
    end: () => {
      console.log('end');
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
        {/* <mac-os-control-btn :mini="true" :disabled="true"></mac-os-control-btn> */}
        <div>{menuOptionsItem?.title}</div>
      </div>
      <div className="charts-item-box-img" ref={drag} style={{ ...containerStyle }}>
        <img src={menuOptionsItem.image} />
      </div>
    </div>
  );
};

export default memo(ChartsItemBox);
