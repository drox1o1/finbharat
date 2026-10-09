import test from 'node:test';
import assert from 'node:assert/strict';
import { approvedSecurityClaim } from '../src/security-claim.mjs';

test('security claim stays unpublished without approval, description and a public evidence URL', () => {
  const complete = { bankGradeApproved: true, securityTitle: 'Bank-Grade Security', securityDescription: 'Approved security controls.', source: 'https://finbharat.example/security/' };
  assert.equal(approvedSecurityClaim(complete), true);
  for (const patch of [{ bankGradeApproved: false }, { securityDescription: '' }, { source: '' }, { source: 'http://localhost:8088/' }, { source: 'https://localhost/' }, { source: 'https://user:secret@finbharat.example/' }, { source: 'javascript:alert(1)' }]) {
    assert.equal(approvedSecurityClaim({ ...complete, ...patch }), false);
  }
  assert.equal(approvedSecurityClaim(undefined), false);
});
