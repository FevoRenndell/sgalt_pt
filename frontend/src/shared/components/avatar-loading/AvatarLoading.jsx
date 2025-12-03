import { StyledAvatar } from './styles';
export function AvatarLoading({
  ref,
  percentage,
  alt = 'user',
  borderSize = 1,
  src = ' ',
  ...others
}) {
  return <StyledAvatar ref={ref} alt={alt} src={src} borderSize={borderSize} deg={Math.round(percentage / 100 * 360)} {...others} />;
}