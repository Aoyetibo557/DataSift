import React from 'react';
import { Card, Button, Space, Alert, Input, Upload, Spin } from 'antd';
import { UploadOutlined, ClearOutlined, ReloadOutlined } from '@ant-design/icons';


const { TextArea } = Input;

export interface DataInputSectionProps {
  rawData: string;
  isParsing: boolean;
  setRawData: (data: string) => void;
  onParseData: () => void;
  onReset: () => void;
}

export const DataInputSection: React.FC<DataInputSectionProps> = ({ rawData, setRawData, onParseData, onReset, isParsing }) => {
  return (
       <Card 
      title="Input Data" 
      extra={
        <Space>
          {rawData.trim() && (
            <Button 
              icon={<ReloadOutlined />}
              onClick={onReset}
              title="Reset all data"
            >
              Reset
            </Button>
          )}
          <Button 
            type="primary" 
            onClick={onParseData}
            disabled={!rawData.trim()}
            loading={isParsing}
          >
            {isParsing ? 'Parsing...' : 'Parse Data'}
          </Button>
        </Space>
      }
    >
      <Space direction="vertical" className="w-full">
        {isParsing && (
          <Alert 
            message="Parsing Data" 
            description="Processing your data, please wait..."
            type="info" 
            showIcon 
            icon={<Spin />}
          />
        )}
        
        {!isParsing && (
          <Alert 
            message="Supported Formats" 
            description="JSON arrays, CSV, TSV, or any delimited text data"
            type="info" 
            showIcon 
          />
        )}
        <TextArea
          value={rawData}
          onChange={(e) => setRawData(e.target.value)}
          placeholder="Paste your raw data here (JSON, CSV, or any structured text)..."
          rows={12}
          className="font-mono text-sm"
        />
        <div className="flex gap-2">
          <Upload
            accept=".json,.csv,.txt"
            showUploadList={false}
            beforeUpload={(file) => {
              const reader = new FileReader();
              reader.onload = (e) => setRawData(e.target.result);
              reader.readAsText(file);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Upload File</Button>
          </Upload>
          <Button 
            icon={<ClearOutlined />} 
            onClick={() => setRawData('')}
            disabled={!rawData}
          >
            Clear
          </Button>
        </div>
      </Space>
    </Card>
  );
};