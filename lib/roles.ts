import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type UserRole = "seeker" | "employer";

export async function getUserRole(uid: string): Promise<UserRole | null> {
  const userDoc = await getDoc(doc(db, "users", uid));
  return userDoc.data()?.role || null;
}

export async function setUserRole(uid: string, role: UserRole): Promise<void> {
  await setDoc(
    doc(db, "users", uid),
    { role, updatedAt: new Date() },
    { merge: true }
  );
}

export const ROLE_REDIRECTS: Record<UserRole, string> = {
  seeker: "/jobs",
  employer: "/employer/dashboard",
};