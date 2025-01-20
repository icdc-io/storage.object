export const mapPoolToDiskTypeOptions = (poolsInfo) => ({
  key: poolsInfo.id,
  text: poolsInfo.s3_placement_target,
  value: poolsInfo.id,
});

export const mapQuotasToDiskType = (quotasInfo) => quotasInfo.pool.klass;
