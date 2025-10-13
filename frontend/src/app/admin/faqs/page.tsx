"use client";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { useState, useEffect } from "react";

type Faq = { id: number; question: string; answer: string };

const API_BASE = 'http://localhost:4000/api';

export default function Faqs() {
  const [data, setData] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/faqs`);
      const faqs = await response.json();
      setData(faqs);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      message.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleAdd = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      const response = await fetch(`${API_BASE}/faqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        message.success('FAQ added successfully');
        setIsModalOpen(false);
        fetchFaqs();
      } else {
        message.error('Failed to add FAQ');
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
        <h3 style={{ fontSize:16 }}>FAQs</h3>
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
          { title:'Question', dataIndex:'question' },
          { title:'Answer', dataIndex:'answer', render: (text: string) => text?.substring(0, 100) + '...' },
          { title:'Actions', render: () => <span style={{ fontSize:12 }}>Edit | Delete</span> }
        ]}
      />
      <Modal
        title="Add New FAQ"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="question" label="Question" rules={[{ required: true, message: 'Please enter a question' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="answer" label="Answer" rules={[{ required: true, message: 'Please enter an answer' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}