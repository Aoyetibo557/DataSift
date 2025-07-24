import React from "react";
import { Card, Row, Col, Statistic } from "antd";

export type DataStatisticsProps = {
  dataStats: {
    totalRows: number;
    totalColumns: number;
    emptyValues: number;
  };
};

export const DataStatistics = ({
  dataStats: { totalRows, totalColumns, emptyValues },
}: DataStatisticsProps) => (
  <Card title="Data Overview">
    <Row gutter={16}>
      <Col span={8}>
        <Statistic title="Rows" value={totalRows} />
      </Col>
      <Col span={8}>
        <Statistic title="Columns" value={totalColumns} />
      </Col>
      <Col span={8}>
        <Statistic
          title="Empty Values"
          value={emptyValues}
          valueStyle={{
            color: emptyValues > 0 ? "#ff4d4f" : "#3f8600",
          }}
        />
      </Col>
    </Row>
  </Card>
);
