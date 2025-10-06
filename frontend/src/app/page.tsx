'use client'
import { useState } from "react";
import {
  Layout,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import "antd/dist/reset.css"; // use 'antd/dist/antd.css' for older versions

const { Header, Content } = Layout;

type User = {
  key: string;
  name: string;
  email: string;
  role: string;
};

export default function Home() {
  const [data, setData] = useState<User[]>([
    { key: "1", name: "Alice", email: "alice@example.com", role: "admin" },
    { key: "2", name: "Bob", email: "bob@example.com", role: "editor" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form] = Form.useForm();

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (record: User) => {
    setEditing(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (key: string) => {
    setData((prev) => prev.filter((r) => r.key !== key));
    message.success("Deleted");
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    if (editing) {
      setData((prev) => prev.map((r) => (r.key === editing.key ? { ...r, ...values } : r)));
      message.success("Updated");
    } else {
      const newItem: User = { key: String(Date.now()), ...values };
      setData((prev) => [newItem, ...prev]);
      message.success("Created");
    }
    setIsModalOpen(false);
  };

  const columns: ColumnsType<User> = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this user?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="link">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Simple client-side guard (demo only). Replace with NextAuth/middleware for real security.
  const isAuthenticated = Boolean(typeof window !== "undefined" && localStorage.getItem("admin_token"));

  if (!isAuthenticated) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{ color: "white" }}>Admin Dashboard — Sign In</Header>
        <Content style={{ padding: 24 }}>
          <Button
            type="primary"
            onClick={() => {
              localStorage.setItem("admin_token", "demo");
              message.success("Signed in (demo)");
              // refresh to show dashboard
              window.location.reload();
            }}
          >
            Sign in (demo)
          </Button>
          <p style={{ marginTop: 12 }}>
            This is a demo guard. Use NextAuth, JWT cookie, or middleware for production auth.
          </p>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ color: "white" }}>Admin Dashboard</Header>
      <Content style={{ padding: 24 }}>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={openCreate}>
            New User
          </Button>
          <Button
            onClick={() => {
              // Example: sync with backend here
              message.info("Syncing with server (demo)");
            }}
          >
            Sync
          </Button>
        </Space>

        <Table columns={columns} dataSource={data} />

        <Modal
          title={editing ? "Edit User" : "Create User"}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={() => setIsModalOpen(false)}
          okText={editing ? "Update" : "Create"}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}
