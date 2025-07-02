export class Transfer {
  constructor(
    public readonly companyId: string,
    public readonly amount: number,
    public readonly debitAccount: string,
    public readonly creditAccount: string,
    public readonly createdAt: Date,
  ) {}

  static create(props: {
    companyId: string;
    amount: number;
    debitAccount: string;
    creditAccount: string;
    createdAt?: Date;
  }): Transfer {
    return new Transfer(
      props.companyId,
      props.amount,
      props.debitAccount,
      props.creditAccount,
      props.createdAt ?? new Date(),
    );
  }
}