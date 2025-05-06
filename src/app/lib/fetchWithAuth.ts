import { getAuth } from "firebase/auth";

export const fetchWithAuth = async (
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  const auth = getAuth();
  const user = auth.currentUser;

  const token = user ? await user.getIdToken() : null;

  const headers = {
    ...init?.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
    "Content-Type": "application/json",
  };

  return fetch(input, {
    ...init,
    headers,
  });
};