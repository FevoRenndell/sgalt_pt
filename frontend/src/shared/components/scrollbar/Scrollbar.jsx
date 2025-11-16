import { StyledScrollBar } from './styles';
export function Scrollbar({
  children,
  sx,
  ...props
}) {
  return <StyledScrollBar sx={{...sx, height: '10ppx'}} {...props}>
      {children}
    </StyledScrollBar>;
}