import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PermitBook } from '../src/permits.ts';
import { harbourtown } from '../src/registers.ts';

const today = '2026-11-02';

function paidPermit() {
  const book = new PermitBook(harbourtown);
  const result = book.request(
    { resident: 'R-1001', address: 'Kadeweg 4', plate: 'HT-101-A' },
    today,
  );
  assert(result.ok);
  book.pay(result.permit.id);
  return { book, permit: result.permit };
}

test('the holder moves a permit to another vehicle, with the same end date', () => {
  const { book, permit } = paidPermit();
  const moved = book.move(permit.id, 'HT-102-B', 'R-1001', '2027-03-10');
  assert(moved.ok);
  assert.equal(moved.permit.plate, 'HT-102-B');
  assert.equal(moved.permit.end, '2027-11-02');
  assert.equal(book.mayPark('HT-102-B', '2027-03-11'), true);
});

test('the old plate may park until the end of the day', () => {
  const { book, permit } = paidPermit();
  book.move(permit.id, 'HT-102-B', 'R-1001', '2027-03-10');
  assert.equal(book.mayPark('HT-101-A', '2027-03-10'), true);
  assert.equal(book.mayPark('HT-101-A', '2027-03-11'), false);
});

test('only the holder can move a permit', () => {
  const { book, permit } = paidPermit();
  const moved = book.move(permit.id, 'HT-201-C', 'R-1002', today);
  assert.deepEqual(moved, {
    ok: false,
    reason: 'Only the holder can move a permit.',
  });
});

test('an unpaid permit cannot be moved', () => {
  const book = new PermitBook(harbourtown);
  const result = book.request(
    { resident: 'R-1001', address: 'Kadeweg 4', plate: 'HT-101-A' },
    today,
  );
  assert(result.ok);
  assert.equal(
    book.move(result.permit.id, 'HT-102-B', 'R-1001', today).ok,
    false,
  );
});
