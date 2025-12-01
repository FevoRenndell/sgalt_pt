// useBlinkingEffect.js
const useBlinkingEffect = (shouldBlink, blinkColor) => ({
  animation: shouldBlink ? 'blink 1s infinite' : 'none',
  '--blink-color': blinkColor,
  '@keyframes blink': {
    '0%, 100%': {
      backgroundColor: 'inherit',
    },
    '50%': {
      backgroundColor: 'var(--blink-color)',
    },
  },
});

export default useBlinkingEffect;
