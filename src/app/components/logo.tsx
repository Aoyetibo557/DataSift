import React from "react";
import Link from "next/link";

export const DataSiftLogo = ({ size = 40 }) => (
  <Link href="/" className="flex items-center">
    <div className="flex items-center gap-3">
      <div
        className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg"
        style={{ width: size, height: size, fontSize: size * 0.4 }}>
        DS
      </div>
      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        DataSift
      </span>
    </div>
  </Link>
);
