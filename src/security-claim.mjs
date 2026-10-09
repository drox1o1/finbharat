// Security claims require explicit approval and a public supporting reference.
export function approvedSecurityClaim(trust) {
  if (!trust?.bankGradeApproved || !trust.securityTitle?.trim() || !trust.securityDescription?.trim()) return false;
  try {
    const source = new URL(trust.source);
    return source.protocol === 'https:' && !source.username && !source.password && !['localhost', '127.0.0.1', '[::1]'].includes(source.hostname);
  } catch { return false; }
}
