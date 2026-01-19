import pick from "lodash/pick";
import { configKeys } from "./configUtils";

let memoId = 0;
let configId = 0;
let commonMemo: any;
const memos: Record<number, any> = {};

export const areConfigsSame = (config1: any, config2: any): boolean => {
  return configKeys.map(k => config1[k] === config2[k]).filter(v => !v).length === 0;
};

export const getCommonMemo = (extendConfig: any) => {
  if (!commonMemo) {
    commonMemo = createConfigMemo({
      reactIndex: undefined,
      maxSize: 3,
      canCompile: undefined, // default is true
      extendConfig,
    });
  }
  return commonMemo;
};

export const findExtendedConfigInAllMemos = (config: any, needsToBeCompiled: any) => {
  let foundExtConfig;
  for (const k in memos) {
    const found = memos[Number(k)].findExtendedConfig(config, needsToBeCompiled);
    if (found) {
      foundExtConfig = found;
      break;
    }
  }
  return foundExtConfig;
};

export const createConfigMemo = (meta: any = {
  reactIndex: undefined,
  maxSize: 2, // current and prev
  canCompile: true as boolean | undefined,
  extendConfig: undefined, // should be passed!
}) => {
  const configStore = new Map<any, any>();
  const maxSize = meta.maxSize || 2;
  const currentMemoId = ++memoId;
  let currentMemo: any;
  let isActive = true;

  const pickConfig = (props: any) => {
    return pick(props, configKeys);
  };

  const extendAndStore = (config: any) => {
    if (!meta.extendConfig) {
      throw new Error("extendConfig is required");
    }
    const extendedConfig = meta.extendConfig(config, ++configId, meta.canCompile);
    storeConfigPair(config, extendedConfig);
    return extendedConfig;
  };

  const getSize = () => {
    return configStore.size;
  };

  const storeConfigPair = (config: any, extendedConfig: any) => {
    if ((configStore.size + 1) > maxSize) {
      configStore.delete(configStore.keys().next().value);
    }
    // Note: because of desctructing, strict find would not be possible
    //  (see commented line in `findExtended`)
    //  (see issue #1187)
    configStore.set({...config}, extendedConfig);
  };

  const findBasic = (findConfig: any) => {
    for (const basicConfig of configStore.keys()) {
      const extConfig = configStore.get(basicConfig);
      const found = areConfigsSame(extConfig, findConfig);
      if (found) {
        return basicConfig;
      }
    }
    return findConfig;
  };

  const findExtended = (findConfig: any, needsToBeCompiled: any = undefined) => {
    // strict find:
    // return configStore.get(findConfig) || configStore.values().find(ec => ec === findConfig);

    for (const savedConfig of configStore.keys()) {
      const foundParts = configKeys.filter(k => savedConfig[k] === findConfig[k]);
      const found = foundParts.length === configKeys.length && (needsToBeCompiled ? savedConfig.__compliled : true);
      if (found) {
        return configStore.get(savedConfig);
      }
    }

    for (const extendedConfig of configStore.values()) {
      const foundParts = configKeys.filter(k => extendedConfig[k] === findConfig[k]);
      const found = foundParts.length === configKeys.length && (needsToBeCompiled ? extendedConfig.__compliled : true);
      if (found) {
        return extendedConfig;
      }
    }

    return null;
  };

  const findOrExtend = (config: any) => {
    return findExtended(config, undefined) || extendAndStore(config);
  };

  const clearConfigMemo = () => {
    isActive = false;
    configStore.clear();
    delete memos[currentMemoId];
    if (commonMemo === currentMemo) {
      commonMemo = undefined;
    }
  };

  currentMemo = {
    getExtendedConfig: (props: any) => findOrExtend(pickConfig(props)),
    findExtendedConfig: findExtended,
    getBasicConfig: findBasic,
    clearConfigMemo,
    configId,
    storeConfigPair,
    getSize,
    configStore,
    memoId: currentMemoId,
    meta,
  };

  if (meta.reactIndex === undefined) {
    commonMemo = currentMemo;
  }
  memos[currentMemoId] = currentMemo;

  return currentMemo;
};
