"use client";
import React, { useState, useCallback, useMemo } from "react";
import { Typography, Row, Col, Space, message } from "antd";
import {
  DataInputSection,
  ColumnSelection,
  CleaningOptions,
  DataPreview,
  DataStatistics,
  DataSiftLogo,
} from "../app/components";
import { parseData, cleanValue } from "../app/utils/utils";

const { Text } = Typography;

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
    message.success("All data has been reset");
  }, []);

  // Parse data when raw data changes
  const handleDataParse = useCallback(() => {
    if (!rawData.trim()) {
      setParsedData([]);
      setCleanedData([]);
      setSelectedColumns([]);
      return;
    }
    setIsParsing(true);

    try {
      const parsed = parseData(rawData);
      setParsedData(parsed);

      if (parsed.length > 0) {
        const columns = Object.keys(parsed[0]);
        setSelectedColumns(columns);
      }

      message.success(`Successfully parsed ${parsed.length} records`);
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
    return Object.keys(parsedData[0]);
  }, [parsedData]);

  // Sample data for preview, ensures the data is normalized first
  const sampleData = useMemo(() => {
    const dataToUse = cleanedData.length > 0 ? cleanedData : parsedData;
    return dataToUse.map((item, index) => {
      // Ensure item is always an object
      const normalizedItem =
        typeof item === "string"
          ? { value: item }
          : (item as Record<string, any>);
      return { ...normalizedItem, key: index };
    });
  }, [parsedData, cleanedData]);

  const dataStats = useMemo(() => {
    const dataToUse = cleanedData.length > 0 ? cleanedData : parsedData;

    // Normalize all rows to objects first
    const normalizedData = dataToUse.map((row) => {
      if (typeof row === "string") {
        // Convert string to object - adjust this logic based on your data format
        return { value: row } as DataRow;
      }
      return row as DataRow;
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <DataSiftLogo />
            <Text className="text-gray-600">
              Smart Data Cleaning & CSV Export Tool
            </Text>
          </div>
        </div>
      </div>

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
