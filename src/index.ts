// ref:
// - https://umijs.org/plugins/api
import { IApi } from 'umi';
import * as fs from 'fs';
import { Mustache } from 'umi/plugin-utils';
import * as path from 'path';
import { generateModelExports } from './generateModelTemp';
import { getModels } from './getModels';

const DIR_NAME_IN_TMP = 'plugin-unstated';

const MODEL_DIR = 'uModels';

const TEMPLATE_DIR = 'templates';

export default function (api: IApi) {
  const {
    paths,
  } = api;
  const isGlobal = api.userConfig?.unstated?.global === true;
  const debug = api.userConfig?.unstated?.debug === true;
  const isOptionalProvider = Array.isArray(api.userConfig?.unstated?.global);
  const providerOption = api.userConfig?.unstated?.global || [];
  const folder = api.userConfig?.unstated?.folder || MODEL_DIR;

  function debugLog(s: string) {
    if (debug) {
      api.logger.info(s);
    }
  }

  debugLog('use plugin unstated');
  debugLog(`folder path: ${folder}`);

  function getModelsPath() {
    return path.join(paths.absSrcPath!, folder);
  }

  api.describe({
    key: 'unstated',
    config: {
      default: {
        global: false,
        folder: MODEL_DIR,
        debug: false,
      },
      schema(joi) {
        return joi.object({
          global: [joi.boolean(), joi.array().items(joi.string())],
          folder: joi.string(),
          debug: joi.boolean(),
        });
      },
    },
  });

  api.onGenerateFiles(async () => {
    api.writeTmpFile({
      content: fs.readFileSync(
        path.join(__dirname, TEMPLATE_DIR, 'unstatedContainer.tsx.tpl'),
        'utf-8',
      ),
      path: `unstatedContainer.tsx`,
    });

    // user models
    const files = getModels(getModelsPath());
    debugLog(`model files: ${files.join(' ')}`)
    const fileTemp = generateModelExports(files);

    api.writeTmpFile({
      content: fileTemp,
      path: `models.tsx`,
    });

    if (isGlobal) {
      api.writeTmpFile({
        content: fs.readFileSync(
          path.join(__dirname, TEMPLATE_DIR, 'injectAll.tsx.tpl'),
          'utf-8',
        ),
        path: `Provider.tsx`,
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
        path: `Provider.tsx`,
      });
    }

    // index
    const exportTpl = fs.readFileSync(
      path.join(__dirname, TEMPLATE_DIR, 'export.tsx.tpl'),
      'utf-8',
    );
    api.writeTmpFile({
      content: exportTpl,
      path: `index.tsx`,
    });

    // runtime.tsx
    api.writeTmpFile({
      path: `runtime.tsx`,
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
    api.addRuntimePlugin(() => `${DIR_NAME_IN_TMP}/runtime`);
  }

  api.addTmpGenerateWatcherPaths(() => {
    const modelsPath = getModelsPath();
    return [modelsPath];
  });
}
