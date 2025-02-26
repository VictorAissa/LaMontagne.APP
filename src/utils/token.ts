import { decodeToken } from "./jwt";

export const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;
    
    try {
      const decoded = decodeToken(token);
      if (!decoded?.exp) return true;
      
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };