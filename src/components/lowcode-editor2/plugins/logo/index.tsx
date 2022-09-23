import type { PluginProps } from '@alilc/lowcode-types';
import type { FC } from 'react';

import './index.scss';

export interface IProps {
  logo?: string;
  href?: string;
}

const Logo: FC<IProps & PluginProps> = (props): React.ReactElement => {
  return (
    <div className="lowcode-plugin-logo">
      <a
        className="logo"
        target="blank"
        href={props.href || 'https://lowcode-engine.cn'}
        style={{ backgroundImage: `url(${props.logo})` }}
      />
    </div>
  );
};

export default Logo;
