"use client";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { useState, useEffect } from "react";

type Link = { id: number; title: string; content: string };

const API_BASE = process.env.API_URL || 'http://localhost:4000/api';

export default function Links() {
  const [data, setData] = useState<Link[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/links`);
      const links = await response.json();
      setData(links);
    } catch (error) {
      console.error('Error fetching Links:', error);
      message.error('Failed to load Links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleAdd = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      const response = await fetch(`${API_BASE}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        message.success('Link added successfully');
        setIsModalOpen(false);
        fetchLinks();
      } else {
        message.error('Failed to add Link');
      }
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Validation failed');
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
        <h3 style={{ fontSize:16 }}>Links</h3>
        <Button type="primary" size="small" onClick={handleAdd}>Add New</Button>
      </div>
      <Table
        size="small"
        rowKey="id"
        loading={loading}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        columns={[
          { title:'ID', dataIndex:'id', width: 80 },
          { title:'Title', dataIndex:'title' },
          { title:'Content', dataIndex:'content', render: (text: string) => text?.substring(0, 100) + '...' },
          { title:'Actions', render: () => <span style={{ fontSize:12 }}>Edit | Delete</span> }
        ]}
      />
      <Modal
        title="Add New Link"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a title' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="url" label="URL" rules={[{ required: true, message: 'Please enter a URL' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}