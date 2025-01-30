"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Header from "./_component/Header";
import Hero from "./_component/Hero";

export default function Home() {
  const { isSignedIn } = useUser(); // Check if the user is logged in
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard"); // Redirect to /dashboard if authenticated
    }
  }, [isSignedIn, router]);

  return (
    <div>
      <Hero />
    </div>
  );
}
