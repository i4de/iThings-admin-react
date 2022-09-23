import { common, plugins, project, skeleton } from '@alilc/lowcode-engine';
import type { ProjectSchema } from '@alilc/lowcode-types';
import { useEffect, useState } from 'react';

// 此 schema 参考 demo 中的默认 schema 书写
// import userSchema from './schema.json'

const userSchema = {
  componentName: 'Page',
  id: 'node_dockcviv8fo1',
  props: {
    ref: 'outerView',
    style: {
      height: '100%',
    },
  },
  fileName: '/',
  dataSource: {
    list: [
      {
        type: 'fetch',
        isInit: true,
        options: {
          params: {},
          method: 'GET',
          isCors: true,
          timeout: 5000,
          headers: {},
          uri: 'mock/info.json',
        },
        id: 'info',
        shouldFetch: {
          type: 'JSFunction',
          value: "function() { \n  console.log('should fetch.....');\n  return true; \n}",
        },
      },
    ],
  },
  state: {
    text: {
      type: 'JSExpression',
      value: '"outer"',
    },
    isShowDialog: {
      type: 'JSExpression',
      value: 'false',
    },
  },
  css: 'body {\n  font-size: 12px;\n}\n\n.button {\n  width: 100px;\n  color: #ff00ff\n}',
  lifeCycles: {
    componentDidMount: {
      type: 'JSFunction',
      value: "function componentDidMount() {\n  console.log('did mount');\n}",
    },
    componentWillUnmount: {
      type: 'JSFunction',
      value: "function componentWillUnmount() {\n  console.log('will unmount');\n}",
    },
  },
  methods: {
    testFunc: {
      type: 'JSFunction',
      value: "function testFunc() {\n  console.log('test func');\n}",
    },
    onClick: {
      type: 'JSFunction',
      value: 'function onClick() {\n  this.setState({\n    isShowDialog: true\n  });\n}',
    },
    closeDialog: {
      type: 'JSFunction',
      value: 'function closeDialog() {\n  this.setState({\n    isShowDialog: false\n  });\n}',
    },
  },
  originCode:
    'class LowcodeComponent extends Component {\n  state = {\n    "text": "outer",\n    "isShowDialog": false\n  }\n  componentDidMount() {\n    console.log(\'did mount\');\n  }\n  componentWillUnmount() {\n    console.log(\'will unmount\');\n  }\n  testFunc() {\n    console.log(\'test func\');\n  }\n  onClick() {\n    this.setState({\n      isShowDialog: true\n    })\n  }\n  closeDialog() {\n    this.setState({\n      isShowDialog: false\n    })\n  }\n}',
  hidden: false,
  title: '',
  isLocked: false,
  condition: true,
  conditionGroup: '',
};
export const LowcodeEditor = () => {
  /** 插件是否已初始化成功，因为必须要等插件初始化后才能渲染 Workbench */
  const [, setHasPluginInited] = useState(false);

  useEffect(() => {
    plugins
      .init()
      .then(() => {
        setHasPluginInited(true);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    project.importSchema(userSchema as ProjectSchema);
  }, [userSchema]);

  //   if (!hasPluginInited) {
  //     return null;
  //   }
  // return <div>123</div>
  return <common.skeletonCabin.Workbench skeleton={skeleton} />;
};

export default LowcodeEditor;
