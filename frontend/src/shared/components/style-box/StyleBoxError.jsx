import { styled } from '@mui/material/styles';

export const StyleBoxError = styled('div')(({
  theme
}) => ({
  padding: 24,
  height: '100%',
  borderRadius: 8,
  backgroundColor:'#199F4E',
  ...theme.applyStyles('dark', {
    backgroundColor: '#7F1D1D',
    opacity: 0.8,
  })
}));