import React from "react";
import { Card } from "antd";
export const Footer = () => {
  return (
    <Card className="bg-gray-800 text-white p-4 text-center">
      <p className="text-sm">
        © {new Date().getFullYear()} DataSift. All rights reserved.
      </p>
        <p className="text-xs">
            Built with ❤️ by{" "}
            <a
            href="https://anuoluwapo-min-portfolio.vercel.app/about"
            target="_blank"
            rel="noopener noreferrer"
            >
              Anuoluwapo Oyetibo
            </a>
          </p>
    
    </Card>
  );
};