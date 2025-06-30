export type CompanyType = 'PYME' | 'CORPORATE';

export class Company {
  constructor(
    public readonly cuit: string,
    public businessName: string,
    public joinedAt: Date,
    public type: CompanyType,
  ) {}

  static create(data: {
    cuit: string;
    businessName: string;
    joinedAt?: Date;
    type: CompanyType;
  }): Company {
    return new Company(
      data.cuit,
      data.businessName,
      data.joinedAt ?? new Date(),
      data.type,
    );
  }
}
