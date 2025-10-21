// Utility formatting functions for consistent display across the app

export function formatValue(key, value) {
  if (value === null || value === undefined) return "—";

  if (typeof value === "number") {
    switch (key) {
      case "headcount":
        return new Intl.NumberFormat("en-CA").format(value);

      case "permEmployeeRate":
      case "nonPermRate":
      case "unionRate":
      case "retirementEligibility":
      case "seniorMgmtRate":
      case "executiveRate":
        // Round percentages to 2 decimal places
        return `${parseFloat(value).toFixed(2)}%`;

      case "yearsOfService":
        // Round to 2 decimals, no suffix
        return parseFloat(value).toFixed(2);

      default:
        return value;
    }
  }

  // Handle ratio strings like "5:1"
  if (typeof value === "string" && value.includes(":")) {
    return value;
  }

  return value;
}

export function formatDiffVsAvg(value, avg, label = "National Average") {
  if (value === null || value === undefined || avg === null || avg === undefined)
    return "—";
  const diff = Math.round(value - avg);
  if (diff === 0) return `Equal to ${label}`;
  const absFmt = new Intl.NumberFormat("en-CA").format(Math.abs(diff));
  return diff > 0
    ? `+${absFmt} above ${label}`
    : `${absFmt} below ${label}`;
}
