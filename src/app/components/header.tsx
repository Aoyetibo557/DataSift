import React from "react";
import Link from "next/link";
import { DataSiftLogo } from "./logo";

export const Header = () => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <DataSiftLogo />
          <Link
            href="/faq"
            className="text-black hover:text-blue-500 hover:underline">
            FAQ
          </Link>
        </div>
      </div>
    </div>
  );
};
