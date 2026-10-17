import test from 'node:test';
import assert from 'node:assert/strict';
import {parseInvitation, invitationPath, invitationRedirect, celebrants} from '../lib/invitations.ts';

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
  for (const segments of [['ru','unknown','amir'], ['en','xasan','amir'], ['ru','xasan','___'], ['ru','xasan','amir','extra'], ['ru','constructor','amir']]) {
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

test('unnamed guests stay absent from links and render as general invitations', () => {
  for (const language of ['ru','uz']) {
    for (const id of ['xasan','xusan']) {
      assert.equal(parseInvitation([language,id]).guest, '');
      assert.equal(invitationPath(language,id), `/${language}/${id}`);
      assert.equal(invitationPath(language,id,'  '), `/${language}/${id}`);
      assert.equal(invitationRedirect([language,id]), null);
    }
  }
});
test('short URLs default to Russian without inventing a guest', () => {
  assert.equal(invitationRedirect(['xasan']), '/ru/xasan');
  assert.equal(invitationRedirect(['xusan']), '/ru/xusan');
  assert.equal(invitationRedirect(['xusan','amir_aka']), '/ru/xusan/amir_aka');
  assert.equal(invitationRedirect(['ru','amir']), '/ru/xasan/amir');
  assert.equal(invitationRedirect(['unknown']), null);
});
