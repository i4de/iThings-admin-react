import { Loading } from '@alifd/next';
import { createFetchHandler } from '@alilc/lowcode-datasource-fetch-handler';
import { injectComponents } from '@alilc/lowcode-plugin-inject';
import ReactRenderer from '@alilc/lowcode-react-renderer';
import { AssetLoader, buildComponents } from '@alilc/lowcode-utils';
import { useState } from 'react';

import { getPackagesFromLocalStorage, getProjectSchemaFromLocalStorage } from './universal/utils';

const getScenarioName = function () {
  if (location.search) {
    return new URLSearchParams(location.search.slice(1)).get('scenarioName') || 'index';
  }
  return 'index';
};

const SamplePreview = () => {
  const [data, setData] = useState({});

  async function init() {
    const scenarioName = getScenarioName();
    const packages = getPackagesFromLocalStorage(scenarioName);
    const projectSchema = getProjectSchemaFromLocalStorage(scenarioName);
    const { componentsMap: componentsMapArray, componentsTree } = projectSchema;
    const componentsMap: any = {};
    componentsMapArray.forEach((component: any) => {
      componentsMap[component.componentName] = component;
    });
    const schema = componentsTree[0];

    const libraryMap = {};
    const libraryAsset = [];
    packages.forEach(({ package: _package, library, urls, renderUrls }) => {
      libraryMap[_package] = library;
      if (renderUrls) {
        libraryAsset.push(renderUrls);
      } else if (urls) {
        libraryAsset.push(urls);
      }
    });

    // const vendors = [assetBundle(libraryAsset, AssetLevel.Library)];

    // TODO asset may cause pollution
    const assetLoader = new AssetLoader();
    await assetLoader.load(libraryAsset);
    const components = await injectComponents(buildComponents(libraryMap, componentsMap));

    setData({
      schema,
      components,
    });
  }

  const { schema, components } = data;

  if (!schema || !components) {
    init();
    return <Loading fullScreen />;
  }

  return (
    <div className="lowcode-plugin-sample-preview">
      <ReactRenderer
        className="lowcode-plugin-sample-preview-content"
        schema={schema}
        components={components}
        appHelper={{
          requestHandlersMap: {
            fetch: createFetchHandler(),
          },
        }}
      />
    </div>
  );
};

export default SamplePreview;
// ReactDOM.render(<SamplePreview />, document.getElementById('ice-container'));
