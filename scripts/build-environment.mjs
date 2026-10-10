export function isProductionBuild(env = process.env) {
  return env.VERCEL_ENV === 'production' || env.VERCEL_TARGET_ENV === 'production' || env.CONTEXT === 'production' || env.PRODUCTION_LAUNCH === '1';
}

export function contentMode(env, repositoryMode) {
  const mode = env.CONTENT_MODE || (env.CMS_URL || env.PRODUCTION_LAUNCH === '1' ? 'wordpress' : repositoryMode);
  if (!['demo', 'wordpress'].includes(mode)) throw new Error('CONTENT_MODE must be demo or wordpress.');
  if (mode === 'demo' && env.PRODUCTION_LAUNCH === '1') throw new Error('Final launch cannot use demo content. Set CONTENT_MODE=wordpress and configure hosted CMS_URL.');
  return mode;
}
