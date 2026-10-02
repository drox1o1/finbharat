export function isProductionBuild(env = process.env) {
  return env.VERCEL_ENV === 'production' || env.VERCEL_TARGET_ENV === 'production' || env.CONTEXT === 'production' || env.PRODUCTION_LAUNCH === '1';
}
