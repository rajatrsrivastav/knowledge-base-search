"use client";
import { Table, Button, Modal, Form, Input, Upload, message } from "antd";
import { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";

type Pdf = { id: number; file_name: string };

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function Pdfs() {
  const [data, setData] = useState<Pdf[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchPdfs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/pdfs`);
      const pdfs = await response.json();
      setData(pdfs);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      message.error('Failed to load PDFs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const handleAdd = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('file', values.file[0].originFileObj);

      const response = await fetch(`${API_BASE}/pdfs`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        message.success('PDF uploaded successfully');
        setIsModalOpen(false);
        fetchPdfs();
      } else {
        message.error('Failed to upload PDF');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      message.error('Upload failed');
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
        <h3 style={{ fontSize:16 }}>PDFs</h3>
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
          { title:'File Name', dataIndex:'file_name' },
          { title:'Actions', render: () => <span style={{ fontSize:12 }}>Edit | Delete</span> }
        ]}
      />
      <Modal
        title="Add New PDF"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a title' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="file"
            label="File"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e && e.fileList;
            }}
            rules={[{ required: true, message: 'Please upload a file' }]}
          >
            <Upload beforeUpload={() => false} maxCount={1} accept=".pdf">
              <Button icon={<UploadOutlined />}>Upload PDF</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
