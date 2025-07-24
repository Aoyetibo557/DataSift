import { CleaningOptions } from "@/app/page";

const parseData = (input: string) => {
  try {
    // Try to parse as JSON first
    const jsonData = JSON.parse(input);
    if (Array.isArray(jsonData)) {
      return jsonData;
    } else if (typeof jsonData === "object") {
      return [jsonData];
    }
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.warn(`Failed to parse JSON: ${errorMsg}`);
    // If JSON parsing fails, try to parse as CSV-like data
    const lines = input.trim().split("\n");
    if (lines.length === 0) return [];

    // Detect delimiter
    const firstLine = lines[0];
    const delimiters = [",", "\t", ";", "|"];
    let delimiter = ",";
    let maxCount = 0;

    delimiters.forEach((d) => {
      const count = (firstLine.match(new RegExp(d, "g")) || []).length;
      if (count > maxCount) {
        maxCount = count;
        delimiter = d;
      }
    });

    // Parse headers and data
    const headers = lines[0]
      .split(delimiter)
      .map((h) => h.trim().replace(/['"]/g, ""));
    const data = lines.slice(1).map((line) => {
      const values = line
        .split(delimiter)
        .map((v) => v.trim().replace(/['"]/g, ""));
      const obj: Record<string, string> = {}; // Add type annotation here
      headers.forEach((header, index) => {
        obj[header] = values[index] || "";
      });
      return obj;
    });

    return data;
  }
  return [];
};

const cleanValue = (value: unknown, cleaningOptions: CleaningOptions) => {
  if (value === null || value === undefined) return "";

  let cleaned = String(value);

  if (cleaningOptions.trimWhitespace) {
    cleaned = cleaned.trim();
  }

  if (cleaningOptions.removeSpecialChars) {
    cleaned = cleaned.replace(/[^\w\s.-]/g, "");
  }

  if (cleaningOptions.standardizeCase === "lower") {
    cleaned = cleaned.toLowerCase();
  } else if (cleaningOptions.standardizeCase === "upper") {
    cleaned = cleaned.toUpperCase();
  } else if (cleaningOptions.standardizeCase === "title") {
    cleaned = cleaned.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  if (cleaningOptions.removeEmptyValues && cleaned === "") {
    return null;
  }

  return cleaned;
};

const downloadCSV = (data: any, filename = "cleaned_data.csv") => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row: any) =>
      headers
        .map((header) => {
          const value = row[header];
          // Wrap in quotes if contains comma, quote, or newline
          if (
            String(value).includes(",") ||
            String(value).includes('"') ||
            String(value).includes("\n")
          ) {
            return `"${String(value).replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
export { parseData, cleanValue, downloadCSV };
export default { parseData, cleanValue, downloadCSV };
