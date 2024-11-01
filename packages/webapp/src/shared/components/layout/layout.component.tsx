import { isNil } from 'ramda';
import { ReactNode, useMemo, useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { NO_NAVIGATION_ROUTES, NO_HEADER_ROUTES } from '../../../app/config/routes';
import { Header } from './header';
import { LayoutContext } from './layout.context';
import { Sidebar } from './sidebar';

export type LayoutProps = {
  children?: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const shouldDisplaySidebar = useMemo(
    () => NO_NAVIGATION_ROUTES.every((path) => isNil(matchPath({ path }, pathname))),
    [pathname]
  );

  const shouldDisplayHeader = useMemo(
    () => NO_HEADER_ROUTES.every((path) => isNil(matchPath({ path }, pathname))),
    [pathname]
  );

  const value = useMemo(
    () => ({ isSidebarAvailable: shouldDisplaySidebar, isSideMenuOpen, setSideMenuOpen }),
    [shouldDisplaySidebar, isSideMenuOpen, setSideMenuOpen]
  );

  return (
    <LayoutContext.Provider value={value}>
      <div className={shouldDisplaySidebar ? 'lg:pl-72' : undefined}>
        {shouldDisplayHeader && <Header />}
        {children}
      </div>
      {shouldDisplaySidebar && <Sidebar />}
    </LayoutContext.Provider>
  );
};
