import { Suspense } from "react";
import RegisterPageClient from "./RegisterPageClient";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-4rem)] bg-white" />}>
      <RegisterPageClient />
    </Suspense>
  );
}


