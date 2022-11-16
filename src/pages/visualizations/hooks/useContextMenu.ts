import { useDispatch } from 'umi';
const useContextMenu = () => {
  const setDispatch = useDispatch();

  // * 失焦
  const onClickOutSide = () => {
    setDispatch({
      type: 'chartEditStore/setRightMenuShow',
      payload: {
        value: false,
      },
    });
  };

  return {
    onClickOutSide,
  };
};

export default useContextMenu;
