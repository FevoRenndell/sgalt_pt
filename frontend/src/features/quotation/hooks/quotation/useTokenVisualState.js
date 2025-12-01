// useTokenVisualState.js
import { useEffect, useState } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors';
import { getHoursLeftFromToken } from '../../../../shared/utils/tokenUtils';
import useBlinkingEffect from '../../../../shared/utils/useBlinkingEffect';
 

export function useTokenVisualState(token) {
  const [hoursLeft, setHoursLeft] = useState(0);
  const [status, setStatus] = useState('success'); // success | warning | error | expired

  useEffect(() => {
    if (!token) return;

    const raw = getHoursLeftFromToken(token); // puede ser negativo
    const h = Math.max(0, raw);               // nunca mostrar < 0
    setHoursLeft(h);

    if (raw <= 0) setStatus('expired');   // ya murió
    else if (raw <= 6) setStatus('error');     // rojo
    else if (raw <= 24) setStatus('warning');  // amarillo
    else setStatus('success');                // verde
  }, [token]);

  // ========= MAPEAMOS VISUAL =========
  let color = '#22c55e';   // success
  let blink = false;
  let Icon = AccessTimeIcon;

  if (status === 'warning') {
    color = '#eab308';     // amarillo
    blink = true;
    Icon = RunningWithErrorsIcon;
  } else if (status === 'error' || status === 'expired') {
    color = '#ef4444';     // rojo
    blink = true;          // ⬅ también parpadea si está expirado
    Icon = RunningWithErrorsIcon;
  }

  const blinkSx = useBlinkingEffect(blink, color);

  return { status, hoursLeft, color, Icon, blinkSx };
}
