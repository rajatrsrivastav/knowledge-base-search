"use client";

import AdminLayout from "./layout";
import { Card, Col, Row, Statistic } from "antd";

export default function AdminPage() {
  return (
    <AdminLayout>
      <h2 style={{ marginBottom: 16 }}>Dashboard</h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Total PDFs" value={1240} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="FAQs Indexed" value={542} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Links Tracked" value={321} />
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
}
