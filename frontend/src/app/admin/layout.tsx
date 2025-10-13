"use client";
import { Layout, Menu } from "antd";
import Link from "next/link";
const { Sider, Content } = Layout;
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={190}>
        <div style={{ color: 'white', padding: 12, fontSize: 14 }}>Admin</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["dash"]} items={[
          { key: 'dash', label: <Link href="/admin">Dashboard</Link> },
          { key: 'pdfs', label: <Link href="/admin/pdfs">PDFs</Link> },
          { key: 'faqs', label: <Link href="/admin/faqs">FAQs</Link> },
          { key: 'links', label: <Link href="/admin/links">Links</Link> },
          { key: 'settings', label: <Link href="/admin/settings">Settings</Link> }
        ]} />
      </Sider>
      <Layout>
        <Content style={{ padding: 16 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
