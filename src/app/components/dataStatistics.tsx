import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';


export const DataStatistics = ({ dataStats }) => (
  <Card title="Data Overview">
    <Row gutter={16}>
      <Col span={8}>
        <Statistic title="Rows" value={dataStats.totalRows} />
      </Col>
      <Col span={8}>
        <Statistic title="Columns" value={dataStats.totalColumns} />
      </Col>
      <Col span={8}>
        <Statistic 
          title="Empty Values" 
          value={dataStats.emptyValues}
          valueStyle={{ color: dataStats.emptyValues > 0 ? '#ff4d4f' : '#3f8600' }}
        />
      </Col>
    </Row>
  </Card>
);