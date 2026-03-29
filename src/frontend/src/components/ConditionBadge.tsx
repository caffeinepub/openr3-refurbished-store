import React from "react";

const conditionStyles: Record<string, string> = {
  Excellent: "bg-blue-100 text-blue-800 border border-blue-200",
  Mint: "bg-green-100 text-green-800 border border-green-200",
  "Open Box": "bg-purple-100 text-purple-700 border border-purple-200",
  Good: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  Average: "bg-orange-100 text-orange-700 border border-orange-200",
  Fair: "bg-red-100 text-red-700 border border-red-200",
};

export function ConditionBadge({ condition }: { condition: string }) {
  const style =
    conditionStyles[condition] ??
    "bg-gray-100 text-gray-700 border border-gray-200";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${style}`}
    >
      {condition}
    </span>
  );
}
