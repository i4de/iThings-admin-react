import { init } from '@alilc/lowcode-engine';
import { useEffect } from 'react';
import registerPlugins from './plugin';

import './global.less';

export default function IndexPage() {
  useEffect(() => {
    const preference = new Map();
    preference.set('DataSourcePane', {
      importPlugins: [],
      dataSourceTypes: [
        {
          type: 'fetch',
        },
        {
          type: 'jsonp',
        },
      ],
    });

    (async function main() {
      await registerPlugins();
      console.log('first-2');

      init(
        document.getElementById('engine-container')!,
        {
          // designMode: 'live',
          // locale: 'zh-CN',
          enableCondition: true,
          enableCanvasLock: true,
          // 默认绑定变量
          supportVariableGlobally: true,
          // simulatorUrl 在当 engine-core.js 同一个父路径下时是不需要配置的！！！
          // 这里因为用的是 alifd cdn，在不同 npm 包，engine-core.js 和 react-simulator-renderer.js 是不同路径
          simulatorUrl: [
            'https://alifd.alicdn.com/npm/@alilc/lowcode-react-simulator-renderer@latest/dist/css/react-simulator-renderer.css',
            'https://alifd.alicdn.com/npm/@alilc/lowcode-react-simulator-renderer@latest/dist/js/react-simulator-renderer.js',
          ],
          requestHandlersMap: {
            fetch: async () => {},
          },
        },
        preference,
      );
    })();
  }, []);
  return <div id="engine-container" style={{ backgroundColor: 'red', height: '850px' }} />;
}
