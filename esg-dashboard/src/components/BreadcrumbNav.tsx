import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const breadcrumbMap = {
  '/': {
    label: 'Home',
    parent: null,
  },
  '/form': {
    label: 'Submit ESG',
    parent: '/',
  },
  '/chatbot': {
    label: 'ESG Analysis',
    parent: '/form',
  },
};

export function BreadcrumbNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    let currentRoute: { label: string; parent: string | null } | null =
      breadcrumbMap[currentPath as keyof typeof breadcrumbMap];

    while (currentRoute) {
      breadcrumbs.unshift(currentRoute);
      currentRoute = currentRoute.parent
        ? breadcrumbMap[currentRoute.parent as keyof typeof breadcrumbMap]
        : null;
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Find route path by label
  const getRouteByLabel = (label: string) => {
    return Object.entries(breadcrumbMap).find(([, value]) => value.label === label)?.[0] || '/';
  };

  return (
    <Breadcrumb className="flex items-center">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <BreadcrumbItem className="flex items-center">
              <ChevronRight className="text-muted-foreground mx-2 h-4 w-4" />
            </BreadcrumbItem>
          )}
          <BreadcrumbItem className="flex items-center">
            <BreadcrumbLink
              asChild
              className="flex items-center"
              aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
            >
              {index === breadcrumbs.length - 1 ? (
                <span>{crumb.label}</span>
              ) : (
                <Link to={getRouteByLabel(crumb.label)}>{crumb.label}</Link>
              )}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </React.Fragment>
      ))}
    </Breadcrumb>
  );
}
