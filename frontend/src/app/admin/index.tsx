"use client";

import AdminLayout from "./layout";
import { Button } from "antd";
import { isAdmin, signInDemo, signOut } from "../../lib/auth";
import { useRouter } from "next/navigation";

export default function AdminIndex() {
  const router = useRouter();
  const auth = isAdmin();

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        {!auth ? (
          <div>
            <p>You must sign in to access the admin dashboard.</p>
            <Button type="primary" onClick={() => { signInDemo(); router.refresh(); router.push('/admin'); }}>
              Sign in (demo)
            </Button>
          </div>
        ) : (
          <div>
            <p>Signed in as demo admin.</p>
            <Button onClick={() => { signOut(); router.refresh(); router.push('/'); }}>Sign out</Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
