export const HTTP_STATUS = {
  OK: { code: 200, description: 'Request processed successfully' },
  CREATED: { code: 201, description: 'Resource created successfully' },
  NO_CONTENT: { code: 204, description: 'No content, operation successful' },
  BAD_REQUEST: { code: 400, description: 'Invalid input data' },
  NOT_FOUND: { code: 404, description: 'Resource not found' },
  INTERNAL_SERVER_ERROR: { code: 500, description: 'Internal server error occurred' }, 
};
