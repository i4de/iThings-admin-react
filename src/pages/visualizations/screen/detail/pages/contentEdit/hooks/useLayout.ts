import { EditCanvasTypeEnum } from '@/models/chartEditStore/chartEditStore';
import { useLayoutEffect } from 'react';
import { useDispatch } from 'umi';
// 布局处理

const useLayout = () => {
  const setDispatch = useDispatch();

  useLayoutEffect(() => {
    setDispatch({
      type: 'chartEditStore/setEditCanvas',
      payload: {
        k: EditCanvasTypeEnum.EDIT_LAYOUT_DOM,
        v: document.getElementById('ithings-chart-edit-layout'),
      },
    });
    setDispatch({
      type: 'chartEditStore/setEditCanvas',
      payload: {
        k: EditCanvasTypeEnum.EDIT_CONTENT_DOM,
        v: document.getElementById('ithings-chart-edit-content'),
      },
    });

    const removeScale = setDispatch({
      type: 'chartEditStore/listenerScale',
    });

    return () => {
      setDispatch({
        type: 'chartEditStore/setEditCanvas',
        payload: {
          k: EditCanvasTypeEnum.EDIT_LAYOUT_DOM,
          v: null,
        },
      });
      setDispatch({
        type: 'chartEditStore/setEditCanvas',
        payload: {
          k: EditCanvasTypeEnum.EDIT_LAYOUT_DOM,
          v: null,
        },
      });
      removeScale();
    };
  }, []);
};
export default useLayout;
