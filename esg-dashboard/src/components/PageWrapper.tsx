import { useOutletContext } from 'react-router-dom';

interface OutletContextType {
  type: 'breadcrumb' | 'content';
}

interface PageWrapperProps {
  breadcrumb: React.ReactNode;
  content: React.ReactNode;
}

export function PageWrapper({ breadcrumb, content }: PageWrapperProps) {
  const { type } = useOutletContext<OutletContextType>();

  if (type === 'breadcrumb') {
    return <>{breadcrumb}</>;
  }

  return <>{content}</>;
}
