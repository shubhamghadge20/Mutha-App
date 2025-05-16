import React from "react";
import XmlMaster from "@/components/Xml/XmlMaster";

const XmlComparePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">XML Comparison</h1>
      <XmlMaster />
    </div>
  );
};

export default XmlComparePage;
