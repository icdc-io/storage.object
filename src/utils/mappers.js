export const mapPoolToDiskTypeOptions = (poolsInfo) => ({
  key: poolsInfo.id,
  text: poolsInfo.name,
  value: poolsInfo.id,
});

export const mapQuotasToDiskType = (quotasInfo) => quotasInfo.pool.klass;
