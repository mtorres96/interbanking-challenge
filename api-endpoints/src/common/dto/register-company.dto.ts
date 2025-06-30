import { ApiProperty } from "@nestjs/swagger";
import { CompanyType } from "src/domain/entities/company.entity";

export class RegisterCompanyDto {
    @ApiProperty({
      example: '20304059999',
      description: 'CUIT de la empresa (clave única)',
    })
    cuit: string;
  
    @ApiProperty({
      example: 'Empresa SRL',
      description: 'Razón Social de la empresa',
    })
    businessName: string;
  
    @ApiProperty({
      example: 'PYME',
      enum: ['PYME', 'CORPORATE'],
      description: 'Tipo de empresa',
    })
    type: CompanyType;
  }