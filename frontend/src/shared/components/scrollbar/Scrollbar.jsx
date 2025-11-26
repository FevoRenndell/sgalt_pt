import { StyledScrollBar } from './styles';
export function Scrollbar({ children, sx, ...props }) {
  return (
    <StyledScrollBar
      {...props}
      sx={{
        height: '100%',       // que llene el alto disponible
        ...sx,
      }}
    >
      {children}
    </StyledScrollBar>
  );
}
