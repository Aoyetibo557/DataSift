import { CleaningOptions } from "@/app/page";

interface ParsedData {
  data: Record<string, any>[];
  format: "json" | "csv" | "xml" | "delimited" | "raw";
  headers?: string[];
}

const parseData = (input: string): ParsedData => {
  if (!input || typeof input !== "string") {
    return { data: [], format: "raw" };
  }

  const trimmedInput = input.trim();
  if (!trimmedInput) {
    return { data: [], format: "raw" };
  }

  // Try JSON first
  try {
    const jsonData = JSON.parse(trimmedInput);
    if (Array.isArray(jsonData)) {
      return {
        data: jsonData.map((item) =>
          typeof item === "object" && item !== null ? item : { value: item }
        ),
        format: "json",
      };
    } else if (typeof jsonData === "object" && jsonData !== null) {
      return {
        data: [jsonData],
        format: "json",
      };
    } else {
      return {
        data: [{ value: jsonData }],
        format: "json",
      };
    }
  } catch (error) {
    console.warn(
      `JSON parsing failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }

  // Try XML parsing
  if (trimmedInput.startsWith("<") && trimmedInput.endsWith(">")) {
    try {
      const xmlData = parseXML(trimmedInput);
      return {
        data: xmlData,
        format: "xml",
      };
    } catch (error) {
      console.warn(
        `XML parsing failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Try delimited data (CSV, TSV, etc.)
  const lines = trimmedInput.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length === 0) {
    return { data: [], format: "raw" };
  }

  // Detect if it's structured delimited data
  if (lines.length > 1) {
    const delimitedResult = parseDelimitedData(lines);
    if (delimitedResult.data.length > 0) {
      return delimitedResult;
    }
  }

  // Handle single line or unstructured data
  if (lines.length === 1) {
    const singleLineResult = parseSingleLine(lines[0]);
    if (singleLineResult.data.length > 0) {
      return singleLineResult;
    }
  }

  // Fallback: treat as raw text data
  return parseRawData(trimmedInput);
};

const parseXML = (xmlString: string): Record<string, any>[] => {
  // Simple XML parser - converts XML to objects
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  // Check for parsing errors
  const parseError = xmlDoc.querySelector("parsererror");
  if (parseError) {
    throw new Error("Invalid XML format");
  }

  const result: Record<string, any>[] = [];

  const parseElement = (element: Element): Record<string, any> => {
    const obj: Record<string, any> = {};

    // Add attributes
    if (element.attributes.length > 0) {
      Array.from(element.attributes).forEach((attr) => {
        obj[`@${attr.name}`] = attr.value;
      });
    }

    // Add child elements and text content
    if (element.children.length === 0) {
      const textContent = element.textContent?.trim();
      if (textContent) {
        obj.value = textContent;
      }
    } else {
      Array.from(element.children).forEach((child) => {
        const childName = child.tagName;
        const childData = parseElement(child);

        if (obj[childName]) {
          if (Array.isArray(obj[childName])) {
            obj[childName].push(childData);
          } else {
            obj[childName] = [obj[childName], childData];
          }
        } else {
          obj[childName] = childData;
        }
      });
    }

    return obj;
  };

  // Handle root element and its children
  const rootElement = xmlDoc.documentElement;
  if (rootElement.children.length > 0) {
    Array.from(rootElement.children).forEach((child) => {
      result.push({ [child.tagName]: parseElement(child) });
    });
  } else {
    result.push(parseElement(rootElement));
  }

  return result;
};

const parseDelimitedData = (lines: string[]): ParsedData => {
  const firstLine = lines[0];

  // Detect delimiter
  const delimiters = [",", "\t", ";", "|", ":", " "];
  let bestDelimiter = ",";
  let maxCount = 0;
  let bestConsistency = 0;

  delimiters.forEach((delimiter) => {
    const counts = lines.map(
      (line) => (line.match(new RegExp(`\\${delimiter}`, "g")) || []).length
    );
    const avgCount = counts.reduce((a, b) => a + b, 0) / counts.length;
    const consistency =
      counts.filter((count) => count === counts[0]).length / counts.length;

    if (
      avgCount > 0 &&
      (avgCount > maxCount ||
        (avgCount === maxCount && consistency > bestConsistency))
    ) {
      maxCount = avgCount;
      bestDelimiter = delimiter;
      bestConsistency = consistency;
    }
  });

  // Only proceed if we found a consistent delimiter pattern
  if (maxCount === 0 || bestConsistency < 0.8) {
    return { data: [], format: "raw" };
  }

  // Parse with detected delimiter
  const headers = parseCSVLine(firstLine, bestDelimiter).map((h) => h.trim());
  const data: Record<string, any>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i], bestDelimiter);
    const obj: Record<string, any> = {};

    headers.forEach((header, index) => {
      const value = values[index]?.trim() || "";
      obj[header] = convertValue(value);
    });

    data.push(obj);
  }

  return {
    data,
    format: bestDelimiter === "," ? "csv" : "delimited",
    headers,
  };
};

const parseSingleLine = (line: string): ParsedData => {
  // Try to detect if it's a delimited single line of data
  const delimiters = [",", "\t", ";", "|", ":", " "];

  for (const delimiter of delimiters) {
    const parts = parseCSVLine(line, delimiter);
    if (parts.length > 1) {
      const obj: Record<string, any> = {};
      parts.forEach((part, index) => {
        obj[`field_${index + 1}`] = convertValue(part.trim());
      });
      return {
        data: [obj],
        format: "delimited",
        headers: Object.keys(obj),
      };
    }
  }

  return { data: [], format: "raw" };
};

const parseRawData = (input: string): ParsedData => {
  // Split by lines and create objects
  const lines = input.split(/\r?\n/).filter((line) => line.trim());
  const data = lines.map((line, index) => ({
    line_number: index + 1,
    content: line.trim(),
  }));

  return {
    data,
    format: "raw",
    headers: ["line_number", "content"],
  };
};

// Helper function to parse CSV-like lines with proper quote handling
const parseCSVLine = (line: string, delimiter: string): string[] => {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  let quoteChar = "";

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (!inQuotes) {
      if (char === '"' || char === "'") {
        inQuotes = true;
        quoteChar = char;
      } else if (char === delimiter) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    } else {
      if (char === quoteChar) {
        if (nextChar === quoteChar) {
          // Escaped quote
          current += char;
          i++; // Skip next character
        } else {
          // End of quoted section
          inQuotes = false;
          quoteChar = "";
        }
      } else {
        current += char;
      }
    }
  }

  result.push(current);
  return result;
};

// Helper function to convert string values to appropriate types
const convertValue = (value: string): any => {
  if (value === "") return "";
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;
  if (value.toLowerCase() === "null") return null;
  if (value.toLowerCase() === "undefined") return undefined;

  // Try to parse as number
  const num = Number(value);
  if (!isNaN(num) && isFinite(num) && value.trim() !== "") {
    return num;
  }

  // Try to parse as date
  const date = new Date(value);
  if (
    (!isNaN(date.getTime()) && value.match(/^\d{4}-\d{2}-\d{2}/)) ||
    value.match(/^\d{1,2}\/\d{1,2}\/\d{4}/)
  ) {
    return date.toISOString();
  }

  return value;
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

// Add this function to your utils file
const flattenObject = (obj: any, prefix = ""): Record<string, any> => {
  const flattened: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value === null || value === undefined) {
        flattened[newKey] = "";
      } else if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      ) {
        // Recursively flatten nested objects
        Object.assign(flattened, flattenObject(value, newKey));
      } else if (Array.isArray(value)) {
        // Convert arrays to comma-separated strings
        flattened[newKey] = value.join(", ");
      } else {
        // Convert everything else to string
        flattened[newKey] = String(value);
      }
    }
  }

  return flattened;
};

export { parseData, cleanValue, downloadCSV, flattenObject };
export default { parseData, cleanValue, downloadCSV, flattenObject };
export type { ParsedData };
