import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

type CompanyType = 'PYME' | 'CORPORATE';

interface RegisterCompanyInput {
  cuit: string;
  businessName: string;
  type: CompanyType;
}

const companies: RegisterCompanyInput[] = []; // En memoria

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing body' }),
      };
    }

    const { cuit, businessName, type } = JSON.parse(event.body);

    if (!cuit || !businessName || !type) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' }),
      };
    }

    if (companies.some((c) => c.cuit === cuit)) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: 'Company already exists' }),
      };
    }

    companies.push({ cuit, businessName, type });

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Company registered successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
