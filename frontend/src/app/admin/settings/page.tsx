"use client";
import { Form, Input, Button, Switch, Card } from "antd";

export default function Settings() {
  const [form] = Form.useForm();

  type SettingsValues = {
    siteTitle?: string;
    adminEmail?: string;
    enableNotifications?: boolean;
  };

  const onFinish = (values: SettingsValues) => {
    console.log('Settings saved:', values);
  };

  return (
    <>
      <h3 style={{ fontSize:16, marginBottom:16 }}>Settings</h3>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            siteTitle: 'Document Search',
            adminEmail: 'admin@example.com',
            enableNotifications: true,
          }}
        >
          <Form.Item name="siteTitle" label="Site Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="adminEmail" label="Admin Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="enableNotifications" label="Enable Notifications" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}