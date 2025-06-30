export class Transfer {
  constructor(
    public readonly companyId: string,
    public readonly amount: number,
    public readonly debitAccount: string,
    public readonly creditAccount: string,
    public readonly date: Date,
  ) {}

  static create(data: {
    companyId: string;
    amount: number;
    debitAccount: string;
    creditAccount: string;
    date?: Date;
  }): Transfer {
    return new Transfer(
      data.companyId,
      data.amount,
      data.debitAccount,
      data.creditAccount,
      data.date ?? new Date(),
    );
  }
}
