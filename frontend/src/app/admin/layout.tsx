"use client";

import { Layout, Menu } from "antd";
import Link from "next/link";
import React from "react";

const { Sider, Content } = Layout;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div className="text-white p-4 font-semibold">InsightEngine</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["dashboard"]}>
          <Menu.Item key="dashboard"><Link href="/admin">Dashboard</Link></Menu.Item>
          <Menu.Item key="pdfs"><Link href="/admin/pdfs">PDFs</Link></Menu.Item>
          <Menu.Item key="faqs">FAQs</Menu.Item>
          <Menu.Item key="links">Links</Menu.Item>
          <Menu.Item key="settings">Settings</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ padding: 24 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
