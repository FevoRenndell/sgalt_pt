import {  useState } from 'react';
// MUI
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
// CUSTOM DEFINED HOOK
import { useSettings } from '../../../shared/hooks/useSettings';
import useLayout from '../context/useLayout';
// CUSTOM ICON COMPONENTS
import Menu from '../../../shared/icons/Menu';
import ThemeIcon from '../../../shared/icons/ThemeIcon';
// STYLED COMPONENTS
import { DashboardHeaderRoot, StyledToolBar } from '../styles';
export default function DashboardHeader() {
  const {
    handleToggleSecondarySideBar
  } = useLayout();
  const {
    settings,
    saveSettings
  } = useSettings();
  const [openSearchBar, setSearchBar] = useState(false);
  const upSm = useMediaQuery(theme => theme.breakpoints.up('sm'));
  const downMd = useMediaQuery(theme => theme.breakpoints.down(1200));
  const handleChangeDirection = value => {
    saveSettings({
      ...settings,
      direction: value
    });
  };
  const handleChangeTheme = value => {
    saveSettings({
      ...settings,
      theme: value
    });
  };
  return <DashboardHeaderRoot position="sticky">
      <StyledToolBar>
        {/* SMALL DEVICE SIDE BAR OPEN BUTTON */}
        {downMd && <IconButton onClick={handleToggleSecondarySideBar}>
            <Menu />
          </IconButton>}
 
        <Box flexGrow={1} ml={1} />

        {/* THEME SWITCH BUTTON */}
        <IconButton onClick={() => {
        handleChangeTheme(settings?.theme === 'light' ? 'dark' : 'light');
      }}>
          <ThemeIcon />
        </IconButton>



 

     
      </StyledToolBar>
    </DashboardHeaderRoot>;
}