import React from 'react';
import EditRule from './components/EditRule';
import useDrag from './hooks/useDrag';

import '@/styles/scrollStyle.less';
import { useAddKeyboard } from '../../../../hooks/useKeyboard';
import EditRange from './components/EditRange';

import './styles.less';

const ContentEdit: React.FC<{ itemBoxOptions: any; allType: any }> = (
  {
    // itemBoxOptions,
    // allType,
  },
) => {
  const { mousedownHandleUnStop, dragHandle, dragoverHandle } = useDrag();

  useAddKeyboard();

  return (
    <>
      {/* 标尺 */}
      <div className="content-edit-rule">
        <EditRule />
      </div>
      <div
        style={{ backgroundColor: '#18181c' }}
        id="ithings-chart-edit-layout"
        draggable
        onMouseDown={mousedownHandleUnStop}
        onDrop={dragHandle}
        onDragOver={dragoverHandle}
        onDragEnter={dragoverHandle}
      >
        <div className="scroll-bar scrollbar-container">
          <div className="scrollbar-content">
            {/* 画布主体 */}
            <div className="ithings-chart-edit-content" style={{ height: '90%' }}>
              {/* 展示 */}
              <EditRange />
            </div>
          </div>
        </div>

        {/* 工具栏  */}
        {/* 底部控制  */}
        <div className="content-bottom"></div>
      </div>
    </>
  );
};
export default ContentEdit;
