import { Outlet } from 'react-router';
// CUSTOM COMPONENTS
import LayoutBodyWrapper from './components/LayoutBodyWrapper';
import LayoutSetting from '../layout-parts/LayoutSetting';
// DASHBOARD LAYOUT BASED CONTEXT PROVIDER
import LayoutProvider from './context/layoutContext';
export default function PublicLayout() {
  return <LayoutProvider>
      {/* DASHBOARD SIDEBAR CONTENT */}

      <LayoutBodyWrapper>
        {/* DASHBOARD HEADER SECTION */}

        {/* MAIN CONTENT RENDER SECTION */}
        <Outlet />

        {/* LAYOUT SETTING SECTION */}
        <LayoutSetting />
      </LayoutBodyWrapper>
    </LayoutProvider>;
}