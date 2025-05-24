import React from "react";
import XmlMaster from "@/components/Xml/XmlMaster";

const Dashboard: React.FC = () => {
  return (
    <main
      className="p-4 bg-white min-h-screen text-gray-800"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <XmlMaster />
    </main>
  );
};

export default Dashboard;
