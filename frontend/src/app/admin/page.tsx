"use client";
import { Card, Col, Row, Statistic } from "antd";
export default function Dashboard() {
  return (
    <>
      <h2 style={{ marginBottom: 12, fontSize: 18 }}>Dashboard</h2>
      <Row gutter={12}>
        <Col span={8}><Card size="small"><Statistic title="Total PDFs" value={120} /></Card></Col>
        <Col span={8}><Card size="small"><Statistic title="FAQs" value={45} /></Card></Col>
        <Col span={8}><Card size="small"><Statistic title="Links" value={78} /></Card></Col>
      </Row>
    </>
  );
}
