import { registerCompany } from './company-service';
import { RegisterCompanyInput } from './types';

// Mock directo del docClient
jest.mock('./dynamo-client', () => ({
  docClient: {
    send: jest.fn(),
  },
}));

import { docClient } from './dynamo-client';

const mockSend = docClient.send as jest.Mock;

describe('registerCompany', () => {
  beforeEach(() => {
    mockSend.mockReset();
  });

  it('should return 400 if required fields are missing', async () => {
    const result = await registerCompany({} as RegisterCompanyInput);

    expect(result.statusCode).toBe(400);
    expect(result.body).toContain('Missing required fields');
  });

  it('should return 409 if CUIT already exists', async () => {
    mockSend.mockResolvedValueOnce({
      Item: { cuit: '20304050601' }, // Simula empresa ya registrada
    });

    const result = await registerCompany({
      cuit: '20304050601',
      businessName: 'Empresa X',
      type: 'PYME',
    });

    expect(result.statusCode).toBe(409);
    expect(result.body).toContain('Company already exists');
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('should register company successfully if CUIT is unique', async () => {
    mockSend
      .mockResolvedValueOnce({}) // GetCommand: no existe
      .mockResolvedValueOnce({}); // PutCommand: insert exitoso

    const result = await registerCompany({
      cuit: '20304059999',
      businessName: 'Empresa Nueva',
      type: 'PYME',
    });

    expect(result.statusCode).toBe(201);
    expect(result.body).toContain('Company registered successfully');
    expect(mockSend).toHaveBeenCalledTimes(2);
  });

});
