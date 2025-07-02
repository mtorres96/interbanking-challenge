import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsString, Matches } from "class-validator";
import { CompanyType } from "src/domain/entities/company.entity";

export class RegisterCompanyDto {

  
    @ApiProperty({
      example: '20304059999',
      description: 'CUIT de la empresa (clave única)',
    })
    @IsNotEmpty()
    @Matches(/^\d{11}$/, { message: 'CUIT must be 11 digits' })
    cuit: string;
  
    @ApiProperty({
      example: 'Empresa SRL',
      description: 'Razón Social de la empresa',
    })

    @IsString()
    @IsNotEmpty()
    businessName: string;
  
    @ApiProperty({
      example: 'PYME',
      enum: ['PYME', 'CORPORATE'],
      description: 'Tipo de empresa',
    })
    @IsIn(['PYME', 'CORPORATE'])
    type: CompanyType;
  }