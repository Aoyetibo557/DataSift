import React from "react";
import { Card, Button, Space, Table, Tooltip, Tag } from "antd";
import {
  EyeOutlined,
  DownloadOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { downloadCSV } from "../utils/utils";

// interface DataRow {
//   key: number;
//   [column: string]: any;
// }

interface DataRow {
  [key: string]: any;
}

interface DataPreviewProps {
  sampleData: DataRow[];
  selectedColumns: string[];
  cleanedData: DataRow[];
  parsedData: DataRow[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
}

export const DataPreview: React.FC<DataPreviewProps> = ({
  sampleData,
  selectedColumns,
  cleanedData,
  parsedData,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  showPreview,
  setShowPreview,
}) => {
  const tableColumns = selectedColumns.map((col) => ({
    title: col,
    dataIndex: col,
    key: col,
    ellipsis: true,
    width: 150,
    render: (text: string) => (
      <Tooltip title={text}>
        <span className="text-sm">{text}</span>
      </Tooltip>
    ),
  }));

  if (sampleData.length === 0) return null;

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          {showPreview ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          Data Preview
          {cleanedData.length > 0 && <Tag color="green">Cleaned</Tag>}
        </div>
      }
      extra={
        <Space>
          <Button
            icon={showPreview ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() =>
              downloadCSV(cleanedData.length > 0 ? cleanedData : parsedData)
            }
            disabled={sampleData.length === 0}>
            Download CSV
          </Button>
        </Space>
      }
      className="mt-6">
      {showPreview ? (
        <Table
          columns={tableColumns}
          dataSource={sampleData}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: sampleData.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
          scroll={{ x: true }}
          size="small"
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          <EyeInvisibleOutlined className="text-4xl mb-2" />
          <p>{`Preview is hidden. Click "Show Preview" to view your data.`}</p>
          <p className="text-sm">Total records: {sampleData.length}</p>
        </div>
      )}
    </Card>
  );
};
