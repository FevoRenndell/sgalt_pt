export const StyledBoxSuccess = styled('div')(({ theme }) => ({
  padding: 24,
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  backdropFilter: 'blur(4px)',
  border: `1px solid ${theme.palette.divider}`,
}));