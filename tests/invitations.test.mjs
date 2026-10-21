import test from 'node:test';
import assert from 'node:assert/strict';
import {parseInvitation, invitationPath, invitationRedirect, celebrants} from '../lib/invitations.ts';

test('each celebrant has an independent invitation in either language', () => {
  for (const language of ['ru', 'tj']) {
    for (const id of ['shavkat', 'shuhrat']) {
      const result = parseInvitation([language, id, 'amir_aka']);
      assert.equal(result.language, language);
      assert.equal(result.celebrant.id, id);
      assert.equal(result.guest, 'Amir Aka');
    }
  }
});
test('invalid routes are rejected instead of showing the wrong person', () => {
  for (const segments of [['ru','unknown','amir'], ['en','shavkat','amir'], ['ru','shavkat','___'], ['ru','shavkat','amir','extra'], ['ru','constructor','amir']]) {
    assert.equal(parseInvitation(segments), null);
  }
});
test('generated links retain language, celebrant, spaces and Unicode names safely', () => {
  assert.equal(invitationPath('tj','shuhrat','  Amir  Aka '), '/tj/shuhrat/amir_aka');
  assert.equal(invitationPath('ru','shavkat','Али Ака'), '/ru/shavkat/%D0%B0%D0%BB%D0%B8_%D0%B0%D0%BA%D0%B0');
  assert.equal(invitationPath('ru','shavkat','A/B? C'), '/ru/shavkat/a%2Fb%3F_c');
});
test('photos and default themes are independently configurable', () => {
  assert.notEqual(celebrants.shavkat, celebrants.shuhrat);
  assert.equal(celebrants.shavkat.name, 'Shavkat');
  assert.equal(celebrants.shuhrat.name, 'Shuhrat');
});

test('unnamed guests stay absent from links and render as general invitations', () => {
  for (const language of ['ru','tj']) {
    for (const id of ['shavkat','shuhrat']) {
      assert.equal(parseInvitation([language,id]).guest, '');
      assert.equal(invitationPath(language,id), `/${language}/${id}`);
      assert.equal(invitationPath(language,id,'  '), `/${language}/${id}`);
      assert.equal(invitationRedirect([language,id]), null);
    }
  }
});
test('short URLs default to Russian without inventing a guest', () => {
  assert.equal(invitationRedirect(['shavkat']), '/ru/shavkat');
  assert.equal(invitationRedirect(['shuhrat']), '/ru/shuhrat');
  assert.equal(invitationRedirect(['shuhrat','amir_aka']), '/ru/shuhrat/amir_aka');
  assert.equal(invitationRedirect(['ru','amir']), '/ru/shavkat/amir');
  assert.equal(invitationRedirect(['unknown']), null);
});

test('old links redirect to the renamed celebrants without losing guests', () => {
  assert.equal(invitationRedirect(['xasan']), '/ru/shavkat');
  assert.equal(invitationRedirect(['xusan']), '/ru/shuhrat');
  assert.equal(invitationRedirect(['ru','xasan','amir_aka']), '/ru/shavkat/amir_aka');
  assert.equal(invitationRedirect(['tj','xusan','amir_aka']), '/tj/shuhrat/amir_aka');
  assert.equal(parseInvitation(['ru','shavkat']).celebrant.name, 'Шавкат');
  assert.equal(parseInvitation(['ru','shuhrat']).celebrant.name, 'Шухрат');
  assert.equal(parseInvitation(['tj','shuhrat']).celebrant.name, 'Шуҳрат');
});

test('old Uzbek links redirect to Tajik with the same guest', () => {
  assert.equal(invitationRedirect(['uz','shuhrat','amir_aka']), '/tj/shuhrat/amir_aka');
  assert.equal(invitationRedirect(['uz','xusan','amir_aka']), '/tj/shuhrat/amir_aka');
  assert.equal(invitationRedirect(['uz','shavkat']), '/tj/shavkat');
  assert.equal(parseInvitation(['uz','shavkat']), null);
});

test('salutations support men, women and families and survive language switching', async () => {
  const {guestGreeting}=await import('../lib/invitations.ts');
  for (const [suffix,name,expected] of [['goy','амир','Дорогой Амир!'],['gaya','малика','Дорогая Малика!'],['giye','насреддиновы','Дорогие Насреддиновы!']]) {
    const parsed=parseInvitation(['ru','shuhrat',suffix,name]);
    assert.equal(guestGreeting('ru',parsed.guest,parsed.salutation),expected);
    const path=invitationPath('tj','shuhrat',parsed.guest,parsed.salutation);
    assert.equal(parseInvitation(path.split('/').slice(1).map(decodeURIComponent)).salutation,suffix);
    assert.equal(invitationRedirect(['shuhrat',suffix,name]),invitationPath('ru','shuhrat',name,suffix));
  }
  assert.equal(guestGreeting('ru','','giye'),'Дорогие гости!');
  assert.equal(guestGreeting('ru','','gaya'),'Дорогая гостья!');
  assert.equal(guestGreeting('ru',''),'Дорогой гость!');
  assert.equal(parseInvitation(['ru','shuhrat','invalid','name']),null);
});

 test('percent-encoded Cyrillic URLs display readable guest names', () => {
  assert.equal(parseInvitation(['ru','shuhrat','gaya',encodeURIComponent('малика')]).guest,'Малика');
});
