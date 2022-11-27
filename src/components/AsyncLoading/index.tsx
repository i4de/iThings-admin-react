import loadingImg from '@/assets/images/tips/loadingSvg.svg';
import React from 'react';

import './styles.less';

const AsyncLoading: React.FC = () => {
  return (
    <div className="ithings-loading-svg ithings-flex-center">
      <img src={loadingImg} alt="" />
    </div>
  );
};

export default AsyncLoading;
