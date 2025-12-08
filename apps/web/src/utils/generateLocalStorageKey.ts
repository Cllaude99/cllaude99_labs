const LOCAL_STORAGE_KEY_PREFIX = 'Cllaude99_labs_';

const generateLocalStorageKey = (key: string) => {
  return `${LOCAL_STORAGE_KEY_PREFIX}_${key}`;
};

export default generateLocalStorageKey;
