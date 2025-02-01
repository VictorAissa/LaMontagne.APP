interface JWTPayload {
    sub: string;
    iat: number;
    exp: number;
  }
  
  export const decodeToken = (token: string): JWTPayload | null => {
    try {
      const base64Payload = token.split('.')[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch {
      return null;
    }
  };