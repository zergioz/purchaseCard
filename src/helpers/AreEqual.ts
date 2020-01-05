export const areEqual = (newObj: any, prevObj: any) => {
  for (const key in newObj) {
    if (newObj[key] !== prevObj[key]) return false;
  }
  return true;
};
