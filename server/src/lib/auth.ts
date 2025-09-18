import jwt from "jsonwebtoken";
export function getUserIdFromToken(token?: string): string | undefined {
  if (!token) return undefined;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub?: string;
    };
    return payload.sub;
  } catch {
    return undefined;
  }
}
