import test from 'node:test';
import assert from 'node:assert/strict';
import {parseInvitation, invitationPath, celebrants} from '../lib/invitations.ts';

test('each celebrant has an independent invitation in either language', () => {
  for (const language of ['ru', 'uz']) {
    for (const id of ['xasan', 'xusan']) {
      const result = parseInvitation([language, id, 'amir_aka']);
      assert.equal(result.language, language);
      assert.equal(result.celebrant.id, id);
      assert.equal(result.guest, 'Amir Aka');
    }
  }
});
test('invalid routes are rejected instead of showing the wrong person', () => {
  for (const segments of [['ru','unknown','amir'], ['en','xasan','amir'], ['ru','xasan'], ['ru','xasan','___'], ['ru','xasan','amir','extra'], ['ru','constructor','amir']]) {
    assert.equal(parseInvitation(segments), null);
  }
});
test('generated links retain language, celebrant, spaces and Unicode names safely', () => {
  assert.equal(invitationPath('uz','xusan','  Amir  Aka '), '/uz/xusan/amir_aka');
  assert.equal(invitationPath('ru','xasan','Али Ака'), '/ru/xasan/%D0%B0%D0%BB%D0%B8_%D0%B0%D0%BA%D0%B0');
  assert.equal(invitationPath('ru','xasan','A/B? C'), '/ru/xasan/a%2Fb%3F_c');
});
test('photos and default themes are independently configurable', () => {
  assert.notEqual(celebrants.xasan, celebrants.xusan);
  assert.equal(celebrants.xasan.name, 'Xasan');
  assert.equal(celebrants.xusan.name, 'Xusan');
});
