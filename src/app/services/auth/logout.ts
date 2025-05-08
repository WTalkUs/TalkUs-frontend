import { getAuth, signOut } from "firebase/auth";
import { app } from "@lib/firebase";

export const logout = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  const auth = getAuth(app);
  try {
    await signOut(auth);
    return { success: true };
  } catch (err: any) {
    console.error("Logout error:", err.message);
    return { success: false, error: err.message };
  }
};
