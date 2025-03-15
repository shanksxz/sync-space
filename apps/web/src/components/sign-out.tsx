"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/server/auth/auth-client";
import { useState } from "react";
import { Button } from "@syncspace/ui/components/ui/button";

export default function SignOut() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleSignOut = async () => {
    try {
      setPending(true);
      await authClient.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setPending(false);
    }
  };

  return (
    <Button onClick={handleSignOut} variant="outline" disabled={pending}>
      Sign Out
    </Button>
  );
}

