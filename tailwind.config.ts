import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					primary: '#3FD07A',
					secondary: '#8E44AD',
					success: '#2ECC71',
					warning: '#E67E22',
					error: '#E74C3C',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				college: {
					blue: "#3366FF",
					lightblue: "#E5EDFF",
					green: "#00A389",
					yellow: "#FFB800",
					orange: "#FF8A00",
					red: "#FF5252",
				},
				dark: {
					DEFAULT: '#0A0A12',
					surface: '#1E1E2C',
					card: '#2A2A3A',
					border: 'rgba(255, 255, 255, 0.1)',
				},
				text: {
					primary: '#E6E6E8',
					secondary: '#9A9AA0',
				},
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-primary': 'linear-gradient(135deg, #3FD07A 0%, #8E44AD 100%)',
				'gradient-surface': 'linear-gradient(135deg, #1E1E2C 0%, #2A2A3A 100%)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				DEFAULT: '12px',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'slide-in': {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'slide-out': {
					'0%': { transform: 'translateX(0)', opacity: '1' },
					'100%': { transform: 'translateX(-100%)', opacity: '0' }
				},
				'count-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '200% 0' },
					'100%': { backgroundPosition: '-200% 0' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 20px rgba(63, 208, 122, 0.2)' },
					'50%': { boxShadow: '0 0 30px rgba(63, 208, 122, 0.4)' }
				},
				'draw-line': {
					'0%': { strokeDashoffset: '1000' },
					'100%': { strokeDashoffset: '0' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'slide-in': 'slide-in 250ms ease-out',
				'slide-out': 'slide-out 250ms ease-out',
				'count-up': 'count-up 500ms cubic-bezier(0.16, 1, 0.3, 1)',
				'shimmer': 'shimmer 8s linear infinite',
				'glow-pulse': 'glow-pulse 12s ease-in-out infinite',
				'draw-line': 'draw-line 1.5s ease-out forwards',
				'slide-in-right': 'slide-in-right 300ms ease-out',
				'fade-in': 'fade-in 200ms ease-out',
			},
			boxShadow: {
				'glow': '0 0 20px rgba(63, 208, 122, 0.2)',
				'glow-strong': '0 0 30px rgba(63, 208, 122, 0.4)',
				'inner-glow': 'inset 0 0 20px rgba(63, 208, 122, 0.1)',
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				heading: ['Outfit', 'sans-serif'],
				mono: ['Source Code Pro', 'monospace'],
			},
		}
	},
	plugins: [animate],
} satisfies Config;
