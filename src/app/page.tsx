"use client";
import React, { useState, useCallback, useMemo } from "react";
import { Typography, Row, Col, Space, message } from "antd";
import {
  DataInputSection,
  ColumnSelection,
  CleaningOptions,
  DataPreview,
  DataStatistics,
} from "../app/components";
import { parseData, cleanValue, flattenObject } from "../app/utils/utils";

export type CleaningOptions = {
  trimWhitespace: boolean;
  removeSpecialChars: boolean;
  standardizeCase: "none" | "lower" | "upper" | "title";
  removeEmptyValues: boolean;
  removeDuplicates: boolean;
};

interface DataRow {
  [key: string]: any;
}

export default function DataSiftApp() {
  const [rawData, setRawData] = useState<string>("");
  const [parsedData, setParsedData] = useState<DataRow[]>([]);
  const [cleanedData, setCleanedData] = useState<DataRow[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [cleaningOptions, setCleaningOptions] = useState<CleaningOptions>({
    trimWhitespace: true,
    removeSpecialChars: false,
    standardizeCase: "none",
    removeEmptyValues: false,
    removeDuplicates: false,
  });
  const [dataFormat, setDataFormat] = useState<string>("");
  const [detectedHeaders, setDetectedHeaders] = useState<string[]>([]);
  const [maxRows, setMaxRows] = useState<number>(1000);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [isCleaning, setIsCleaning] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(true);

  const handleReset = useCallback(() => {
    setRawData("");
    setParsedData([]);
    setCleanedData([]);
    setSelectedColumns([]);
    setCurrentPage(1);
    setShowPreview(true);
    setDataFormat("");
    setDetectedHeaders([]);
    message.success("All data has been reset");
  }, []);

  // Parse data when raw data changes
  const handleDataParse = useCallback(() => {
    if (!rawData.trim()) {
      setParsedData([]);
      setCleanedData([]);
      setSelectedColumns([]);
      setDataFormat("");
      setDetectedHeaders([]);
      return;
    }
    setIsParsing(true);

    try {
      const result = parseData(rawData); // Now returns ParsedData object
      setParsedData(result.data);
      setDataFormat(result.format);
      setDetectedHeaders(result.headers || []);

      if (result.data.length > 0) {
        const columns = Object.keys(result.data[0]);
        setSelectedColumns(columns);
      }

      message.success(
        `Successfully parsed ${
          result.data.length
        } records as ${result.format.toUpperCase()}`
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      message.error(
        `Failed to parse data. Please check your input format. ${errorMessage}`
      );
    } finally {
      setIsParsing(false);
    }
  }, [rawData]);

  // Clean data handler
  const handleDataCleaning = useCallback(() => {
    if (parsedData.length === 0) return;

    setIsCleaning(true);

    try {
      let cleaned = parsedData.map((row) => {
        const cleanedRow: DataRow = {};
        selectedColumns.forEach((col) => {
          const cleanedValue = cleanValue(
            (row as unknown as DataRow)[col],
            cleaningOptions
          );
          if (cleanedValue !== null) {
            cleanedRow[col] = cleanedValue;
          }
        });
        return cleanedRow;
      });

      if (cleaningOptions.removeDuplicates) {
        const seen = new Set();
        cleaned = cleaned.filter((row) => {
          const key = JSON.stringify(row);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }

      if (maxRows && maxRows > 0) {
        cleaned = cleaned.slice(0, maxRows);
      }

      setCleanedData(cleaned);
      message.success(
        `Data cleaned successfully! ${cleaned.length} records ready.`
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      message.error(
        `Failed to clean data. Please check your settings. ${errorMessage}`
      );
    } finally {
      setIsCleaning(false);
    }
  }, [parsedData, selectedColumns, cleaningOptions, maxRows]);

  // Computed values
  const availableColumns = useMemo(() => {
    if (parsedData.length === 0) return [];

    // Get columns from the flattened version
    const firstItem = parsedData[0];
    if (typeof firstItem === "string") {
      return ["value"];
    } else if (typeof firstItem === "object" && firstItem !== null) {
      const flattened = flattenObject(firstItem);
      return Object.keys(flattened);
    }

    return ["value"];
  }, [parsedData]);

  // Sample data for preview, ensures the data is normalized first
  const sampleData = useMemo(() => {
    const dataToUse = cleanedData.length > 0 ? cleanedData : parsedData;
    return dataToUse.map((item, index) => {
      // Ensures item is always an object and flatten nested objects
      let normalizedItem: Record<string, any>;

      if (typeof item === "string") {
        normalizedItem = { value: item };
      } else if (typeof item === "object" && item !== null) {
        normalizedItem = flattenObject(item);
      } else {
        normalizedItem = { value: String(item) };
      }

      return { ...normalizedItem, key: index };
    });
  }, [parsedData, cleanedData]);

  const dataStats = useMemo(() => {
    const dataToUse = cleanedData.length > 0 ? cleanedData : parsedData;

    // Normalize and flatten all rows to objects first
    const normalizedData = dataToUse.map((row) => {
      if (typeof row === "string") {
        return { value: row } as DataRow;
      } else if (typeof row === "object" && row !== null) {
        return flattenObject(row) as DataRow;
      }
      return { value: String(row) } as DataRow;
    });

    return {
      totalRows: normalizedData.length,
      totalColumns: selectedColumns.length,
      emptyValues: normalizedData.reduce((acc, row) => {
        return (
          acc +
          selectedColumns.filter((col) => !row[col] || row[col] === "").length
        );
      }, 0),
    };
  }, [parsedData, cleanedData, selectedColumns]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Row gutter={[24, 24]}>
          {/* Input Section */}
          <Col xs={24} lg={12}>
            <DataInputSection
              rawData={rawData}
              setRawData={setRawData}
              isParsing={isParsing}
              onReset={handleReset}
              onParseData={handleDataParse}
              dataFormat={dataFormat}
            />
          </Col>

          {/* Right Column - Settings & Stats */}
          <Col xs={24} lg={12}>
            <Space direction="vertical" className="w-full" size="large">
              {parsedData.length > 0 && (
                <DataStatistics dataStats={dataStats} />
              )}

              {availableColumns.length > 0 && (
                <ColumnSelection
                  availableColumns={availableColumns}
                  selectedColumns={selectedColumns}
                  setSelectedColumns={setSelectedColumns}
                />
              )}

              {parsedData.length > 0 && (
                <CleaningOptions
                  cleaningOptions={cleaningOptions}
                  setCleaningOptions={setCleaningOptions}
                  maxRows={maxRows}
                  setMaxRows={setMaxRows}
                  onCleanData={handleDataCleaning}
                  selectedColumns={selectedColumns}
                  isCleaning={isCleaning}
                />
              )}
            </Space>
          </Col>
        </Row>

        {/* Data Preview Section */}
        <div className="mt-6">
          <DataPreview
            sampleData={sampleData}
            selectedColumns={selectedColumns}
            cleanedData={cleanedData}
            parsedData={parsedData}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            showPreview={showPreview}
            setShowPreview={setShowPreview}
          />
        </div>
      </div>
    </div>
  );
}
