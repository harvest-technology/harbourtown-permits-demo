import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PermitBook } from '../../permits/src/permits.ts';
import { harbourtown } from '../../permits/src/registers.ts';

const issuedDay = '2026-11-02';
const moveDay = '2026-11-05';

function paidPermit() {
  const book = new PermitBook(harbourtown);
  const issued = book.request(
    { resident: 'R-1001', address: 'Kadeweg 4', plate: 'HT-101-A' },
    issuedDay,
  );
  assert(issued.ok);
  book.pay(issued.permit.id);
  return { book, permit: issued.permit };
}

test('AC1: the new plate may park on the move day', () => {
  const { book, permit } = paidPermit();
  assert(book.move(permit.id, 'HT-102-B', 'R-1001', moveDay).ok);
  assert.equal(book.mayPark('HT-102-B', moveDay), true);
});

test('AC1: the old plate stops on the move day', () => {
  const { book, permit } = paidPermit();
  assert(book.move(permit.id, 'HT-102-B', 'R-1001', moveDay).ok);
  assert.equal(book.mayPark('HT-101-A', moveDay), false);
});

test('AC2: a plate registered to another resident is refused', () => {
  const { book, permit } = paidPermit();
  assert.equal(book.move(permit.id, 'HT-201-C', 'R-1001', moveDay).ok, false);
});

test('AC3: someone other than the holder is refused', () => {
  const { book, permit } = paidPermit();
  assert.equal(book.move(permit.id, 'HT-201-C', 'R-1002', moveDay).ok, false);
});

test('AC4: an unpaid permit is refused', () => {
  const book = new PermitBook(harbourtown);
  const issued = book.request(
    { resident: 'R-1001', address: 'Kadeweg 4', plate: 'HT-101-A' },
    issuedDay,
  );
  assert(issued.ok);
  assert.equal(
    book.move(issued.permit.id, 'HT-102-B', 'R-1001', moveDay).ok,
    false,
  );
});

test('AC4: an expired permit is refused', () => {
  const { book, permit } = paidPermit();
  assert.equal(
    book.move(permit.id, 'HT-102-B', 'R-1001', '2027-11-02').ok,
    false,
  );
});

test('AC5: end date, price and paid status are kept', () => {
  const { book, permit } = paidPermit();
  const moved = book.move(permit.id, 'HT-102-B', 'R-1001', moveDay);
  assert(moved.ok);
  assert.equal(moved.permit.end, '2027-11-02');
  assert.equal(moved.permit.price, 6000);
  assert.equal(moved.permit.paid, true);
});
