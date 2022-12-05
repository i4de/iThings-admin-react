import type { ReactNode } from 'react';

export type renderTableItemProps = {
  icon?: ReactNode;
  title: string;
  key: string;
  children: ReactNode;
};

const useRenderTableItem = () => {
  const renderTableItem = (item: renderTableItemProps) => {
    return {
      label: (
        <div className="tabs-label n-text">
          {item?.icon}
          {item.title}
        </div>
      ),
      key: item?.key,
      children: item.children,
    };
  };
  return { renderTableItem };
};
export default useRenderTableItem;
