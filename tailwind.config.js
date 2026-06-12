/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:         '#ffc107',
        'primary-light': '#ffd54f',
        secondary:       '#7c5cbf',
        'secondary-light':'#a78bfa',
        accent:          '#4caf50',
        'accent-light':  '#81c784',
        surface:         'rgba(30,30,100,0.7)',
        muted:           'rgba(255,255,255,0.4)',
        subtle:          'rgba(255,255,255,0.6)',
        border:          'rgba(255,255,255,0.1)',
        gold:            '#ffc107',
        green:           '#4caf50',
        red:             '#ef5350',
      },
      fontFamily: {
        display: ['Fredoka', 'Nunito', 'system-ui', 'sans-serif'],
        body:    ['Nunito', 'system-ui', 'sans-serif'],
        sans:    ['Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl':  '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      animation: {
        'fade-in':     'fadeIn 0.35s ease',
        'slide-up':    'slideUp 0.38s cubic-bezier(0.4,0,0.2,1)',
        'bounce-in':   'bounceIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        'pulse-slow':  'pulse 3s ease-in-out infinite',
        'float':       'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(18px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        bounceIn:  { from: { opacity: 0, transform: 'scale(0.88)' }, to: { opacity: 1, transform: 'scale(1)' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
    },
  },
  plugins: [],
};
