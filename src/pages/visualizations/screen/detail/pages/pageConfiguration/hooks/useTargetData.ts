import { TabsEnum } from '@/pages/visualizations/screen/detail/pages/pageConfiguration';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'umi';

export const useTargetData = (props?: any) => {
  const { tabsSelect } = props || {};

  const setDispatch = useDispatch();
  const { targetChart, componentList, targetId } = useSelector((state) => state.chartEditStore);

  // 缓存targetId
  // TODO: 在store中新增state值保存
  const selectTarget = useMemo(() => {
    const selectId = targetChart.selectId;
    if (selectId.length !== 1) return undefined;
    let target;
    if (targetId !== undefined) {
      target = componentList[targetId];
    }
    if (target?.isGroup && tabsSelect) {
      tabsSelect.current = TabsEnum.CHART_SETTING;
    }
    return target;
  }, [componentList, tabsSelect, targetChart.selectId, targetId]);

  useEffect(() => {
    setDispatch({
      type: 'chartEditStore/fetchTargetIndex',
    });
  }, [setDispatch, targetChart]);

  return { selectTarget };
};
