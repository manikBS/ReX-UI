import { useEffect, useState } from 'react';
import { PageHeadline } from '@sb/webapp-core/components/pageHeadline';
import { PageLayout } from '@sb/webapp-core/components/pageLayout';
import { H4, Paragraph } from '@sb/webapp-core/components/typography';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage, useIntl } from 'react-intl';
import { ArrowUpRight, Edit, Play, Download } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@sb/webapp-core/components/cards';

type ReportTemplate = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export const Home = () => {
  const intl = useIntl();
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([]);

  useEffect(() => {
    fetch('/api/reports/report-templates/', {
      headers: {
        'accept': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => setReportTemplates(data));
  }, []);

  const handleRun = (id: string) => {
    // Implement the run functionality for the template
  };

  const handleEdit = (id: string) => {
    // Redirect to edit page or modal for editing the template
  };

  const handleDownload = (id: string) => {
    window.location.href = `http://localhost:5001/api/reports/report-templates/${id}/download/`;
  };

  return (
    <PageLayout className="w-screen h-screen p-0 overflow-hidden">
      <Helmet
        title={intl.formatMessage({
          defaultMessage: 'Homepage',
          id: 'Home / page title',
        })}
      />

      <PageHeadline
        header={<FormattedMessage defaultMessage="Report Templates" id="Home / header" />}
        subheader={
          <FormattedMessage
            defaultMessage="Browse and manage your report templates."
            id="Home / subheading"
          />
        }
      />

      <div className="flex overflow-x-auto space-x-4 p-4 w-full">
        {reportTemplates.map((template, index) => (
          <Card
            key={template.id}
            className={`min-w-[250px] max-w-[250px] p-3 rounded-lg shadow-lg ${
              index % 2 === 0 ? 'bg-blue-100' : 'bg-red-100'
            }`}
          >
            <CardHeader className="flex items-center justify-between">
              <img
                src="https://via.placeholder.com/40" // Placeholder image URL
                alt="Template"
                className="rounded-full h-10 w-10 object-cover"
              />
            </CardHeader>
            <CardContent>
              <Paragraph className="text-black text-xs mb-2">
                <H4 className="text-primary font-semibold text-sm">{template.name}</H4>
              </Paragraph>
              <div className="text-xs text-gray-700 mt-1">
                <p><strong>Description:</strong> {template.description}</p>
                <p><strong>Created:</strong> {new Date(template.created_at).toLocaleDateString()}</p>
                <p><strong>Updated:</strong> {new Date(template.updated_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between mt-2 space-x-2">
              <Play
                className="w-5 h-5 cursor-pointer text-blue-600 hover:text-blue-800"
                onClick={() => handleRun(template.id)}
              />
              <Edit
                className="w-5 h-5 cursor-pointer text-blue-600 hover:text-blue-800"
                onClick={() => handleEdit(template.id)}
              />
              <Download
                className="w-5 h-5 cursor-pointer text-blue-600 hover:text-blue-800"
                onClick={() => handleDownload(template.id)}
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
};
