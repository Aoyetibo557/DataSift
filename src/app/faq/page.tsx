"use client";
import React from "react";
import { Typography, Collapse, Card, Space, Tag } from "antd";
import {
  QuestionCircleOutlined,
  FileTextOutlined,
  SettingOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const FAQ = () => {
  const faqItems = [
    {
      key: "1",
      label: "What file formats does DataSift support?",
      icon: <FileTextOutlined />,
      children: (
        <div>
          <Paragraph>
            DataSift automatically detects and supports multiple data formats:
          </Paragraph>
          <Space wrap>
            <Tag color="blue">JSON</Tag>
            <Tag color="green">CSV</Tag>
            <Tag color="orange">XML</Tag>
            <Tag color="purple">TSV (Tab-separated)</Tag>
            <Tag color="cyan">Pipe-delimited (|)</Tag>
            <Tag color="magenta">Semicolon-delimited (;)</Tag>
            <Tag color="red">Raw Text</Tag>
          </Space>
          <Paragraph className="mt-3">
            Simply paste your data into the input area, and DataSift will
            automatically detect the format and parse it accordingly. The tool
            can handle quoted fields, nested objects, and mixed data types.
          </Paragraph>
        </div>
      ),
    },
    {
      key: "2",
      label: "How does the data cleaning process work?",
      icon: <SettingOutlined />,
      children: (
        <div>
          <Paragraph>
            DataSift offers several cleaning options that you can combine:
          </Paragraph>
          <ul className="ml-4 space-y-2">
            <li>
              <strong>Trim Whitespace:</strong> Removes leading and trailing
              spaces from all values
            </li>
            <li>
              <strong>Remove Special Characters:</strong> Keeps only letters,
              numbers, spaces, dots, and hyphens
            </li>
            <li>
              <strong>Standardize Case:</strong> Convert text to lowercase,
              uppercase, or title case
            </li>
            <li>
              <strong>Remove Empty Values:</strong> Filters out rows with empty
              or null values
            </li>
            <li>
              <strong>Remove Duplicates:</strong> Eliminates duplicate rows
              based on all column values
            </li>
          </ul>
          <Paragraph className="mt-3">
            You can also limit the number of rows in your final output and
            select specific columns to include in the cleaned dataset.
          </Paragraph>
        </div>
      ),
    },
    {
      key: "3",
      label: "What happens to complex data like XML or nested JSON?",
      icon: <QuestionCircleOutlined />,
      children: (
        <div>
          <Paragraph>
            DataSift intelligently handles complex data structures:
          </Paragraph>
          <ul className="ml-4 space-y-2">
            <li>
              <strong>Nested Objects:</strong> Flattened using dot notation
              (e.g., <code>address.street</code>, <code>user.profile.name</code>
              )
            </li>
            <li>
              <strong>Arrays:</strong> Converted to comma-separated strings for
              easy viewing and export
            </li>
            <li>
              <strong>XML Attributes:</strong> Preserved with @ prefix (e.g.,{" "}
              <code>@id</code>, <code>@class</code>)
            </li>
            <li>
              <strong>Mixed Data Types:</strong> Automatically converted to
              appropriate types (numbers, booleans, dates)
            </li>
          </ul>
          <Paragraph className="mt-3">
            This ensures that even complex data structures can be cleaned,
            filtered, and exported as CSV files while preserving all the
            original information in a readable format.
          </Paragraph>
        </div>
      ),
    },
    {
      key: "4",
      label: "How do I export my cleaned data?",
      icon: <DownloadOutlined />,
      children: (
        <div>
          <Paragraph>
            Once you've cleaned your data, exporting is simple:
          </Paragraph>
          <ol className="ml-4 space-y-2">
            <li>
              Complete the data cleaning process using your preferred settings
            </li>
            <li>Review the cleaned data in the preview table</li>
            <li>Click the "Download CSV" button in the Data Preview section</li>
            <li>
              Your cleaned data will be downloaded as a properly formatted CSV
              file
            </li>
          </ol>
          <Paragraph className="mt-3">
            The exported CSV file includes:
          </Paragraph>
          <ul className="ml-4 space-y-1">
            <li>
              • Properly quoted fields containing commas or special characters
            </li>
            <li>• All selected columns in the order they appear</li>
            <li>• UTF-8 encoding for international character support</li>
            <li>
              • Standard CSV format compatible with Excel, Google Sheets, and
              other tools
            </li>
          </ul>
        </div>
      ),
    },
    {
      key: "5",
      label: "Are there any file size or row limits?",
      icon: <QuestionCircleOutlined />,
      children: (
        <div>
          <Paragraph>
            DataSift is designed to handle various data sizes efficiently:
          </Paragraph>
          <ul className="ml-4 space-y-2">
            <li>
              <strong>Input Size:</strong> No strict file size limit, but very
              large datasets may take longer to process
            </li>
            <li>
              <strong>Row Limit:</strong> You can set a maximum number of rows
              (default: 1000) to control output size
            </li>
            <li>
              <strong>Preview Limit:</strong> The preview table shows data in
              pages (default: 10 rows per page) for better performance
            </li>
            <li>
              <strong>Memory Usage:</strong> All processing happens in your
              browser, so available RAM determines practical limits
            </li>
          </ul>
          <Paragraph className="mt-3">
            <Text type="secondary">
              Tip: For very large datasets, consider splitting them into smaller
              chunks or increasing the row limit gradually to find the optimal
              balance between completeness and performance.
            </Text>
          </Paragraph>
        </div>
      ),
    },
    {
      key: "6",
      label: "Is my data secure? Do you store anything?",
      icon: <QuestionCircleOutlined />,
      children: (
        <div>
          <Paragraph>
            <Text strong>Your data privacy is our priority:</Text>
          </Paragraph>
          <ul className="ml-4 space-y-2">
            <li>
              <strong>Client-Side Processing:</strong> All data parsing and
              cleaning happens entirely in your browser
            </li>
            <li>
              <strong>No Server Storage:</strong> Your data never leaves your
              computer or gets sent to our servers
            </li>
            <li>
              <strong>No Account Required:</strong> Use DataSift without
              creating accounts or providing personal information
            </li>
            <li>
              <strong>Session-Only Storage:</strong> Data exists only while you
              have the page open and is cleared when you close it
            </li>
          </ul>
          <Paragraph className="mt-3">
            <Text type="success">
              This means you can safely process sensitive data like customer
              information, financial records, or personal data without any
              privacy concerns.
            </Text>
          </Paragraph>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <Title level={1} className="mb-2">
              Frequently Asked Questions
            </Title>
            <Paragraph className="text-lg text-gray-600">
              Everything you need to know about using DataSift for data cleaning
              and CSV export
            </Paragraph>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-sm">
          <Collapse
            size="large"
            expandIconPosition="start"
            ghost
            items={faqItems.map((item) => ({
              key: item.key,
              label: (
                <div className="flex items-center space-x-3">
                  <span className="text-blue-500">{item.icon}</span>
                  <span className="font-medium text-gray-800">
                    {item.label}
                  </span>
                </div>
              ),
              children: item.children,
            }))}
            className="faq-collapse"
          />
        </Card>

        {/* Contact Section */}
        <Card className="mt-8 text-center shadow-sm">
          <Title level={3}>Still have questions?</Title>
          <Paragraph className="text-gray-600 mb-4">
            Can't find what you're looking for? We're here to help!
          </Paragraph>
          <Space>
            <Text type="secondary">
              Contact us at: <Text code>support@datasift.com</Text>
            </Text>
          </Space>
        </Card>
      </div>

      <style jsx>{`
        .faq-collapse .ant-collapse-item {
          border-bottom: 1px solid #f0f0f0;
        }

        .faq-collapse .ant-collapse-item:last-child {
          border-bottom: none;
        }

        .faq-collapse .ant-collapse-header {
          padding: 16px 0 !important;
        }

        .faq-collapse .ant-collapse-content-box {
          padding: 0 0 16px 0 !important;
        }

        code {
          background-color: #f6f8fa;
          padding: 2px 4px;
          border-radius: 3px;
          font-size: 0.9em;
        }
      `}</style>
    </div>
  );
};

export default FAQ;
