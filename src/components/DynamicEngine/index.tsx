import { FC, memo, useMemo } from 'react';
import { dynamic } from 'umi';
// import { AllTemplateType } from './schema';

export type componentsType = 'media' | 'base' | 'visible';

const DynamicFunc = (type: any, category: any, chartKey: any) => {
  console.log(`@/packages/components/${type}/${category}/${chartKey}/${chartKey}.tsx`);

  return dynamic({
    loader: async function () {
      const { default: Graph } = await import(
        `@/packages/components/${type}/${category}/${chartKey}/${chartKey}.tsx`
      );
      const Component: FC<{ isTpl: boolean }> = Graph;

      return (props: DynamicType) => {
        // console.log(config);
        return <Component {...props} />;
      };
    },
    // loading: () => (
    //   <div style={{ paddingTop: 10, textAlign: 'center' }}>
    //     <Loading />
    //   </div>
    // ),
  });
};

type DynamicType = {
  isTpl: boolean;
  config: { [key: string]: any };
  type: any;
  componentsType: componentsType;
  category: componentsType;
};
const DynamicEngine = memo((props: DynamicType) => {
  const { type, category, chartKey } = props;
  const Dynamic = useMemo(() => {
    return DynamicFunc(type, category, chartKey.split('V')[1]) as unknown as FC<DynamicType>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Dynamic {...props} />;
});

export default DynamicEngine;
