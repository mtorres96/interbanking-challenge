export type CompanyType = 'PYME' | 'CORPORATE';

export interface RegisterCompanyInput {
  cuit: string;
  businessName: string;
  type: CompanyType;
}