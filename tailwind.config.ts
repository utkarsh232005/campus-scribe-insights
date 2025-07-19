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
					primary: 'hsl(220 9% 46%)',
					secondary: 'hsl(220 13% 18%)',
					success: 'hsl(142 71% 45%)',
					warning: 'hsl(38 92% 50%)',
					error: 'hsl(0 84% 60%)',
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
				professional: {
					slate: 'hsl(215 28% 17%)',
					gray: 'hsl(220 9% 46%)',
					'light-gray': 'hsl(220 14% 96%)',
					white: 'hsl(0 0% 100%)',
					dark: 'hsl(220 13% 18%)',
					blue: 'hsl(217 91% 60%)',
					'light-blue': 'hsl(210 100% 97%)',
				},
				text: {
					primary: 'hsl(220 13% 18%)',
					secondary: 'hsl(220 9% 46%)',
					muted: 'hsl(217 11% 65%)',
				},
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-primary': 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(220 13% 18%) 100%)',
				'gradient-surface': 'linear-gradient(135deg, hsl(220 14% 96%) 0%, hsl(220 13% 91%) 100%)',
				'gradient-professional': 'linear-gradient(135deg, hsl(220 9% 46%) 0%, hsl(215 28% 17%) 100%)',
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
					'0%, 100%': { boxShadow: '0 0 20px hsl(217 91% 60% / 0.2)' },
					'50%': { boxShadow: '0 0 30px hsl(217 91% 60% / 0.4)' }
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
				'glow': '0 0 20px hsl(217 91% 60% / 0.2)',
				'glow-strong': '0 0 30px hsl(217 91% 60% / 0.4)',
				'inner-glow': 'inset 0 0 20px hsl(217 91% 60% / 0.1)',
				'professional': '0 4px 6px -1px hsl(220 9% 46% / 0.1), 0 2px 4px -1px hsl(220 9% 46% / 0.06)',
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
