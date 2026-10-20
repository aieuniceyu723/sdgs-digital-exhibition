import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fees, households } from '../src/data.js';

const reference = JSON.parse(
  await readFile(new URL('./fixtures/official-tables.json', import.meta.url), 'utf8'),
);

test('兒童費用分類及比率與官方引用快照一致，不正規化尾差', () => {
  assert.equal(fees.length, 8);
  assert.deepEqual(fees, reference.children.values);
  assert.equal(Math.round(fees.reduce((sum, fee) => sum + fee.share, 0) * 10), 1001);
});

test('五所得組的人口及教育年支出與官方引用快照一致', () => {
  assert.equal(households.length, 5);
  assert.deepEqual(
    households.map(({ group, people, education }) => ({ group, people, education })),
    reference.households.values,
  );
});

test('圖表的固定比較尺度能容納所有公布值', () => {
  assert.ok(fees.every((fee) => fee.share > 0 && fee.share <= 40));
  assert.ok(
    households.every((household) => household.education > 0 && household.education <= 60000),
  );
});
