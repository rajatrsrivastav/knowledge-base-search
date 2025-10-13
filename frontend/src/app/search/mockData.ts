export type Document = {
  id: string;
  title: string;
  type: 'PDF' | 'FAQ' | 'Link';
  content: string;
  url?: string;
};

export const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'How to Onboard New Employees',
    type: 'FAQ',
    content: 'This FAQ covers the onboarding process for new employees, including paperwork, training, and first day activities.',
  },
  {
    id: '2',
    title: 'Company Handbook',
    type: 'PDF',
    content: 'The official company handbook containing policies, procedures, and guidelines for all employees.',
    url: '/docs/handbook.pdf',
  },
  {
    id: '3',
    title: 'IT Support Contact',
    type: 'Link',
    content: 'Contact information for IT support team.',
    url: 'mailto:it@company.com',
  },
  {
    id: '4',
    title: 'Benefits Overview',
    type: 'PDF',
    content: 'Detailed overview of employee benefits including health insurance, retirement plans, and paid time off.',
    url: '/docs/benefits.pdf',
  },
  {
    id: '5',
    title: 'Remote Work Policy',
    type: 'FAQ',
    content: 'Guidelines for remote work, including equipment setup, communication expectations, and productivity tracking.',
  },
];