import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/useResponsive';
import { useSettingsContext } from 'src/components/settings';
import { useSelector } from 'react-redux';
import Main from './main';
import Header from './header';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';
import NavHorizontal from './nav-horizontal';

function getNavigationComponent(settings, lgUp, menuNav, nav) {

  const { themeLayout } = settings;

  switch (themeLayout) {
    case 'horizontal':
      return lgUp ? <NavHorizontal menuNav={menuNav} /> : <NavVertical menuNav={menuNav} openNav={nav.value} onCloseNav={nav.onFalse} />;
    case 'mini':
      return lgUp ? <NavMini       menuNav={menuNav} /> : <NavVertical menuNav={menuNav} openNav={nav.value} onCloseNav={nav.onFalse} />;
    default:
      return                                              <NavVertical menuNav={menuNav} openNav={nav.value} onCloseNav={nav.onFalse} />;
  }

}

function getSx(settings) {

  const { themeLayout } = settings;

  if (themeLayout === 'horizontal') {
    return {}
  }

  return {minHeight: 1,display: 'flex',flexDirection: { xs: 'column', lg: 'row' }};
}

export default function DashboardLayout({ children }) {

  const menuNav = useSelector(state => state.permissions.navigations);

  const settings = useSettingsContext();
  const lgUp = useResponsive('up', 'lg');
  const nav = useBoolean();

  const navigationComponent = getNavigationComponent(settings, lgUp, menuNav, nav);

  return (
    <>
      <Header onOpenNav={nav.onTrue} menuNav={menuNav} />
      <Box sx={getSx(settings)}>
        {navigationComponent}
        <Main>{children}</Main>
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
