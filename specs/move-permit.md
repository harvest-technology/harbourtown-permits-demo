# Move a permit to another vehicle

Agreed by the permits product owner for this prepared review case. These are
the human-owned requirements, not assumptions the agent may change.

## Intent

A resident who replaces their car can move an existing parking permit online,
without buying another permit or losing its remaining validity.

## Constraints

- Only the permit holder may request the move.
- The vehicle register must list that holder as keeper of the new plate.
- The permit must be paid and valid on the move date.
- The new plate may park immediately; the old plate stops immediately.
- Moving is free. The end date, paid status and price remain unchanged.
- Amounts are euro cents and dates are ISO days.

## Acceptance criteria

| ID  | Given                                                    | When                                          | Then                                                                          |
| --- | -------------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------- |
| AC1 | R-1001 has a paid permit for HT-101-A from 2026-11-02    | The holder moves it to HT-102-B on 2026-11-05 | The move succeeds; the new plate may park that day and the old one may not    |
| AC2 | The permit belongs to R-1001; HT-201-C belongs to R-1002 | The holder requests HT-201-C                  | Refuse the move                                                               |
| AC3 | A permit belonging to R-1001                             | R-1002 requests the move                      | Refuse the move                                                               |
| AC4 | An unpaid or expired permit                              | Its holder requests a move                    | Refuse the move                                                               |
| AC5 | A paid permit ending 2027-11-02 with price 6000 cents    | A valid move succeeds                         | Keep that end date, price and paid status                                     |
| AC6 | Existing requests, payments and renewals                 | Moving permits is implemented                 | Existing acceptance examples still pass; a renewal starts at the old end date |

AC1 to AC5 have executable examples in `test/acceptance/move.test.ts`.
AC6 is also checked by the existing renewal example in
`test/acceptance/request.test.ts`.

## Out of scope

Do not change renewal dates, payment rules, prices, address limits, test
selection or CI workflows to implement this feature.

## Instruction

Read this spec and `AGENTS.md` before changing code. List assumptions before
building and ask the product owner about gaps. Do not override an agreed rule
with an assumption. Do not edit the human-owned acceptance tests. Report all
behaviour changes and the actual check results.
