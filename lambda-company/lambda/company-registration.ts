import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { registerCompany } from './company-service';
import { RegisterCompanyInput } from './types';

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

    const input: RegisterCompanyInput = JSON.parse(event.body);
    return await registerCompany(input);
  } catch (error) {
    console.error('Error in Lambda:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
