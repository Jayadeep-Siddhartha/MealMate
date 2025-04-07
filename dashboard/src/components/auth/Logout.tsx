// src/components/auth/LogoutButton.tsx
"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

export default function Logout() {
  return <Button onClick={() => signOut(auth)}>Sign out</Button>;
}
