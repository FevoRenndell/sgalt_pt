import { styled } from '@mui/material/styles';

export const StyleBoxSuccess = styled('div')(({
  theme
}) => ({
  padding: 24,
  height: '100%',
  borderRadius: 8,
  backgroundColor:'#199F4E',
  ...theme.applyStyles('dark', {
    backgroundColor: '#065E49',
    opacity: 0.8,
  })
}));