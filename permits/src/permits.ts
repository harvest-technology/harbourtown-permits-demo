// Parking permits for Harbourtown residents. Amounts are in euro cents, dates are ISO days.
import type { Registers } from './registers.ts';

export const FIRST_PERMIT = 6000;
export const SECOND_PERMIT = 12000;
export const PER_ADDRESS = 2;
export const MONTHS = 12;

export type Permit = {
  id: number;
  holder: string;
  address: string;
  plate: string;
  start: string;
  end: string;
  price: number;
  paid: boolean;
};

export type Request = { resident: string; address: string; plate: string };

export type Result =
  { ok: true; permit: Permit } | { ok: false; reason: string };

/** The day `months` months after `day`, as an ISO day. */
export function addMonths(day: string, months: number): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + months);
  return date.toISOString().slice(0, 10);
}

/** The day `days` days after `day`, as an ISO day. */
export function addDays(day: string, days: number): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Whether the permit lets its plate park on `day`. */
export const isValid = (permit: Permit, day: string): boolean =>
  permit.paid && permit.start <= day && day < permit.end;

export class PermitBook {
  readonly permits: Permit[] = [];
  private registers: Registers;

  constructor(registers: Registers) {
    this.registers = registers;
  }

  /** Requests a permit, or renews the resident's permit for the same plate. Unpaid until paid. */
  request(request: Request, today: string): Result {
    const { resident, address, plate } = request;
    if (!this.registers.livesAt(resident, address))
      return { ok: false, reason: 'You are not registered at this address.' };
    if (!this.registers.keeps(resident, plate))
      return { ok: false, reason: 'This vehicle is not registered to you.' };

    const current = this.permits.find(
      (permit) =>
        permit.holder === resident &&
        permit.plate === plate &&
        isValid(permit, today),
    );
    if (current) {
      // A renewal starts today, like a new permit.
      return this.issue({ ...request, start: today }, current.price);
    }

    const atAddress = this.permits.filter(
      (permit) => permit.address === address && isValid(permit, today),
    );
    if (atAddress.length >= PER_ADDRESS)
      return {
        ok: false,
        reason: `An address can have at most ${PER_ADDRESS} permits.`,
      };
    const price = atAddress.length === 0 ? FIRST_PERMIT : SECOND_PERMIT;
    return this.issue({ ...request, start: today }, price);
  }

  /** Marks a permit as paid. Only a paid permit is valid. */
  pay(id: number): void {
    const permit = this.permits.find((candidate) => candidate.id === id);
    if (!permit) throw new Error(`No permit ${id}`);
    permit.paid = true;
  }

  /** Moves a valid permit to another vehicle. The permit keeps its end date and stays paid. */
  move(
    permitId: number,
    plate: string,
    resident: string,
    today: string,
  ): Result {
    const permit = this.permits.find((candidate) => candidate.id === permitId);
    if (!permit) return { ok: false, reason: 'No such permit.' };
    if (permit.holder !== resident)
      return { ok: false, reason: 'Only the holder can move a permit.' };
    if (!isValid(permit, today))
      return { ok: false, reason: 'Only a valid permit can be moved.' };

    const end = permit.end;
    const tomorrow = addDays(today, 1);
    // The old plate may park until the end of today, so the resident can swap cars.
    permit.end = tomorrow;
    const moved: Permit = {
      ...permit,
      id: this.permits.length + 1,
      plate,
      start: tomorrow,
      end,
    };
    this.permits.push(moved);
    return { ok: true, permit: moved };
  }

  /** Whether any permit lets the plate park on `day`. */
  mayPark(plate: string, day: string): boolean {
    return this.permits.some(
      (permit) => permit.plate === plate && isValid(permit, day),
    );
  }

  private issue(request: Request & { start: string }, price: number): Result {
    const permit: Permit = {
      id: this.permits.length + 1,
      holder: request.resident,
      address: request.address,
      plate: request.plate,
      start: request.start,
      end: addMonths(request.start, MONTHS),
      price,
      paid: false,
    };
    this.permits.push(permit);
    return { ok: true, permit };
  }
}
