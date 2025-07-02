// lambda/company-service.ts
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from './dynamo-client';
import { RegisterCompanyInput } from './types';

export async function registerCompany(input: RegisterCompanyInput) {
  if (!input.cuit || !input.businessName || !input.type) {
    return { statusCode: 400, body: JSON.stringify({ message: 'Missing required fields' }) };
  }

  const { Item } = await docClient.send(
    new GetCommand({
      TableName: 'Companies',
      Key: { cuit: input.cuit },
    })
  );

  if (Item) {
    return { statusCode: 409, body: JSON.stringify({ message: 'Company already exists' }) };
  }

  await docClient.send(
    new PutCommand({
      TableName: 'Companies',
      Item: input,
    })
  );

  return {
    statusCode: 201,
    body: JSON.stringify({ message: 'Company registered successfully' }),
  };
}
