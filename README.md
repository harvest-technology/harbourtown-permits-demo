# Prepared Harbourtown review case

This branch has a completed human-owned spec, decision rights and acceptance
examples. It is not the blank participant starter.

## Review the prepared change

- `main`: the learner's fill-in starter.
- `review/move-permit`: the agreed inputs, before implementation.
- `agent/move-permit`: the prepared agent implementation on those inputs.

Compare `review/move-permit` with `agent/move-permit` in a pull request or with
`git diff review/move-permit...agent/move-permit`. Read
`specs/move-permit.md`, `AGENTS.md`, `test/acceptance/move.test.ts` and
`RELEASES.md`, not just the agent's commit description.

## Run the evidence

```sh
npm ci
npm run check
node --test "test/acceptance/*.test.ts"
```

On the review baseline, move examples fail because the feature is not built.
On the prepared agent branch, compare the ordinary check with the independent
acceptance command. A failing example is evidence to review, not an instruction
to weaken it. The draft release note has not been approved by a person.
