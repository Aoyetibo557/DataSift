import React from 'react';
import { Card, Button, Checkbox, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface ColumnSelectionProps {
    availableColumns: string[];
    selectedColumns: string[];
    setSelectedColumns: (cols: string[]) => void;
}

export const ColumnSelection: React.FC<ColumnSelectionProps> = ({ availableColumns, selectedColumns, setSelectedColumns }) => (
  <Card 
    title="Column Selection" 
    extra={
      <Button 
        size="small"
        onClick={() => setSelectedColumns(
          selectedColumns.length === availableColumns.length ? [] : availableColumns
        )}
      >
        {selectedColumns.length === availableColumns.length ? 'Deselect All' : 'Select All'}
      </Button>
    }
  >
    <Checkbox.Group
      value={selectedColumns}
      onChange={setSelectedColumns}
      className="w-full"
    >
      <Row gutter={[8, 8]}>
        {availableColumns.map(col => (
          <Col span={12} key={col}>
            <Checkbox value={col} className="text-sm">
              {col}
            </Checkbox>
          </Col>
        ))}
      </Row>
    </Checkbox.Group>
  </Card>
);