import { Fragment } from 'react';
// MUI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import { FlexRowAlign } from '../shared/components/Flexbox';

// =========================================================================

// =========================================================================

export default function Layout({
  children,
  login
}) {
  return <Grid container height="100%">
      <Grid size={{
      md: 6,
      xs: 12
    }}>

      </Grid>

      <Grid size={{
      md: 6,
      xs: 12
    }}>
        <FlexRowAlign bgcolor="background.paper" height="100%">
          {children}
        </FlexRowAlign>
      </Grid>
    </Grid>;
}