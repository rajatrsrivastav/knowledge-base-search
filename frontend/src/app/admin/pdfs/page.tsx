"use client";

import AdminLayout from "../layout";
import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import { fetchPdfs } from "../../api/mockServer";

type Pdf = { id: string; title: string; uploaded: string };

export default function PdfsPage() {
  const [data, setData] = useState<Pdf[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetchPdfs({ page }).then((res) => {
      setData(res.items);
      setLoading(false);
    });
  }, [page]);

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3>PDFs</h3>
        <Button type="primary">Add New PDF</Button>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        pagination={{ current: page, total: 50, onChange: (p) => setPage(p) }}
        columns={[
          { title: 'Title', dataIndex: 'title', key: 'title' },
          { title: 'Uploaded', dataIndex: 'uploaded', key: 'uploaded' },
          { title: 'Actions', key: 'actions', render: () => 'Edit | Delete' },
        ]}
      />
    </AdminLayout>
  );
}
