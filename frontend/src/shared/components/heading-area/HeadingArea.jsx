 
// MUI
import Tab from '@mui/material/Tab';
 
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { styled, alpha } from '@mui/material/styles';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
// CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from '../../../shared/components/FlexBox';
// CUSTOM ICON COMPONENTS
import GroupSenior from '../../../shared/icons/GroupSenior';
 
// STYLED COMPONENT
const TabListWrapper = styled(TabList)(({
  theme
}) => ({
  borderBottom: 0,
  [theme.breakpoints.down(727)]: {
    order: 3
  }
}));
const StyledAvatar = styled(Avatar)(({
  theme
}) => ({
  width: 36,
  height: 36,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '.icon': {
    fontSize: 22,
    color: theme.palette.primary.main
  }
}));

// ===================================================================

// ===================================================================

export default function HeadingArea({
  value,
  changeTab,
  addButton,
  tab_active = false
}) {  
  return <FlexBetween flexWrap="wrap" gap={1}>
      <FlexBox alignItems="center" gap={1.5}>
        <StyledAvatar variant="rounded">
          <GroupSenior className="icon" />
        </StyledAvatar>

        <Typography variant="body1" fontWeight={500}>
          Users
        </Typography>
      </FlexBox>
      {tab_active && (
        
      <TabContext value={value} >
        <TabListWrapper variant="scrollable"  onChange={changeTab}  >
          <Tab disableRipple label="All Users" value={0} />
          <Tab disableRipple label="Administradores" value={1} />
          <Tab disableRipple label="Clientes" value={2} />
          <Tab disableRipple label="Cotizadores" value={3} />
        </TabListWrapper>
      </TabContext>
      )}
      { addButton }
    </FlexBetween>;
}