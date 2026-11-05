# Instructions for coding agents

Harbourtown is fictional. All residents, addresses and plates are invented.
This prepared case uses the product owner's agreed spec in
`specs/move-permit.md` and independent examples in `test/acceptance/`.

## Work

- Implement the spec without changing its decisions.
- List assumptions and ask about unresolved questions before coding.
- Run `npm run check` and report its actual result.
- Amounts are euro cents; dates are ISO days.

## Decision rights

These decisions are already agreed for the prepared case.

| Action                                                    | Alone | After review | Never |
| --------------------------------------------------------- | ----- | ------------ | ----- |
| Implement the move in permits/src and add developer tests | Yes   |              |       |
| Change package.json, test selection or a workflow         |       | Yes          |       |
| Deploy, roll back or restart production                   |       | Yes          |       |
| Change the spec or human-owned acceptance examples        |       |              | Yes   |

## Never

- Do not change `test/acceptance/` to make your implementation pass.
- Do not change unrelated renewal, payment or pricing behaviour.
- Do not claim a vehicle-register check exists without checking the code.
