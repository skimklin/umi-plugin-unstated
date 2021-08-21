// ref:
// - https://umijs.org/plugins/api
import { IApi } from '@umijs/types';
import * as fs from 'fs';
import * as path from 'path';
import { generateModelExports } from './generateModelTemp';
import { getModels } from './getModels';

const DIR_NAME_IN_TMP = 'plugin-unstated';

const MODEL_DIR = 'uModels';

const TEMPLATE_DIR = 'templates';

export default function (api: IApi) {
  const {
    paths,
    utils: { Mustache, winPath, lodash },
  } = api;
  api.logger.info('use plugin unstated');

  const isGlobal = api.userConfig?.unstated?.global === true;
  const isOptionalProvider = Array.isArray(api.userConfig?.unstated?.global);
  const providerOption = api.userConfig?.unstated?.global || [];

  function getModelsPath() {
    return path.join(paths.absSrcPath!, MODEL_DIR);
  }

  api.describe({
    key: 'unstated',
    config: {
      default: {
        global: false,
      },
      schema(joi) {
        return joi.object({
          global: [joi.boolean(), joi.array().items(joi.string())],
        });
      },
    },
  });

  api.onGenerateFiles(async () => {
    // umi export
    const exportTpl = fs.readFileSync(
      path.join(__dirname, TEMPLATE_DIR, 'createContainer.tsx.tpl'),
      'utf-8',
    );
    // user models
    const files = getModels(getModelsPath());
    const fileTemp = generateModelExports(files);

    api.writeTmpFile({
      content: fileTemp,
      path: `${DIR_NAME_IN_TMP}/models.tsx`,
    });

    if (isGlobal) {
      api.writeTmpFile({
        content: fs.readFileSync(
          path.join(__dirname, TEMPLATE_DIR, 'injectAll.tsx.tpl'),
          'utf-8',
        ),
        path: `${DIR_NAME_IN_TMP}/Provider.tsx`,
      });
    } else if (isOptionalProvider) {
      api.writeTmpFile({
        content: Mustache.render(
          fs.readFileSync(
            path.join(__dirname, TEMPLATE_DIR, 'inject.tsx.tpl'),
            'utf-8',
          ),
          {
            GLOBAL_PROVIDERS:
              providerOption.length > 0
                ? `[${providerOption.map((e: string) => `\'${e}\'`).join(',')}]`
                : '[]',
          },
        ),
        path: `${DIR_NAME_IN_TMP}/Provider.tsx`,
      });
    }

    api.writeTmpFile({
      content: exportTpl,
      path: `${DIR_NAME_IN_TMP}/export.tsx`,
    });

    // runtime.tsx
    api.writeTmpFile({
      path: `${DIR_NAME_IN_TMP}/runtime.tsx`,
      content: Mustache.render(
        fs.readFileSync(
          path.join(__dirname, TEMPLATE_DIR, 'runtime.tsx.tpl'),
          'utf-8',
        ),
        {},
      ),
    });
  });

  if (isGlobal || isOptionalProvider) {
    // Add provider wrapper with rootContainer
    api.addRuntimePlugin(() => `../${DIR_NAME_IN_TMP}/runtime`);
  }

  api.addTmpGenerateWatcherPaths(() => {
    const modelsPath = getModelsPath();
    return [modelsPath];
  });

  api.addUmiExports(() => [
    {
      exportAll: true,
      source: `../${DIR_NAME_IN_TMP}/export`,
    },
  ]);
}
