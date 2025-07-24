import React from "react";
import {
  Card,
  Alert,
  Spin,
  Button,
  Space,
  InputNumber,
  Select,
  Switch,
  Typography,
} from "antd";
import { CleaningOptions as CleaningOptionsType } from "../page";
const { Text } = Typography;

export interface CleaningOptionsProps {
  cleaningOptions: CleaningOptionsType;
  setCleaningOptions: React.Dispatch<React.SetStateAction<CleaningOptionsType>>;
  maxRows: number;
  setMaxRows: React.Dispatch<React.SetStateAction<number>>;
  onCleanData: () => void;
  selectedColumns: string[];
  isCleaning: boolean;
}

export const CleaningOptions: React.FC<CleaningOptionsProps> = ({
  cleaningOptions,
  setCleaningOptions,
  maxRows,
  setMaxRows,
  onCleanData,
  selectedColumns,
  isCleaning,
}) => (
  <Card
    title="Data Cleaning Options"
    extra={
      <Button
        type="primary"
        onClick={onCleanData}
        disabled={selectedColumns.length === 0}
        loading={isCleaning}>
        {isCleaning ? "Cleaning..." : "Clean Data"}
      </Button>
    }>
    {isCleaning && (
      <div className="mb-4">
        <Alert
          message="Cleaning Data"
          description="Applying cleaning rules to your data, please wait..."
          type="info"
          showIcon
          icon={<Spin />}
        />
      </div>
    )}
    <Space direction="vertical" className="w-full">
      <div className="flex items-center justify-between">
        <Text>Trim Whitespace</Text>
        <Switch
          checked={cleaningOptions.trimWhitespace}
          onChange={(checked) =>
            setCleaningOptions((prev: CleaningOptionsType) => ({
              ...prev,
              trimWhitespace: checked,
            }))
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <Text>Remove Special Characters</Text>
        <Switch
          checked={cleaningOptions.removeSpecialChars}
          onChange={(checked) =>
            setCleaningOptions((prev) => ({
              ...prev,
              removeSpecialChars: checked,
            }))
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <Text>Remove Duplicates</Text>
        <Switch
          checked={cleaningOptions.removeDuplicates}
          onChange={(checked) =>
            setCleaningOptions((prev) => ({
              ...prev,
              removeDuplicates: checked,
            }))
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <Text>Remove Empty Values</Text>
        <Switch
          checked={cleaningOptions.removeEmptyValues}
          onChange={(checked) =>
            setCleaningOptions((prev) => ({
              ...prev,
              removeEmptyValues: checked,
            }))
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <Text>Case Standardization</Text>
        <Select
          value={cleaningOptions.standardizeCase}
          onChange={(value) =>
            setCleaningOptions((prev) => ({ ...prev, standardizeCase: value }))
          }
          style={{ width: 120 }}>
          <Select.Option value="none">None</Select.Option>
          <Select.Option value="lower">Lowercase</Select.Option>
          <Select.Option value="upper">Uppercase</Select.Option>
          <Select.Option value="title">Title Case</Select.Option>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Text>Max Rows (0 = unlimited)</Text>
        <InputNumber
          value={maxRows}
          onChange={(value) => setMaxRows(value ?? 0)}
          min={0}
          max={100000}
          style={{ width: 120 }}
        />
      </div>
    </Space>
  </Card>
);
