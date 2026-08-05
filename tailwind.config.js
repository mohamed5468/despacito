 tailwind.config = {
          theme: {
            extend: {
              colors: {
                primary: "#d90441",
                secondary: "#2E2024",
                accent: "#3A2830",
                gold: { DEFAULT: "#C77B87", light: "#F0C4CB", dark: "#A8636F" },
                rose: { DEFAULT: "#F5AEB8", dark: "#E2818F", light: "#FFADBC" },
                cream: "#D4ADA2",
                background: "#FFF7FA",
                surface: "#FFFFFF",
                ivory: "#FFF9F5",
                pearl: "#F4EDEC",
                graystone: "#8B7B7E"
              },
              fontFamily: {
                 'cairo': ['Cairo', 'sans-serif'],
                 'dmserif': ['Cairo', 'sans-serif']
              },
              boxShadow: {
                'luxury-sm': '0 4px 20px rgba(61, 43, 51, 0.03)',
                'luxury-md': '0 20px 40px -10px rgba(61, 43, 51, 0.06)',
                'luxury-lg': '0 30px 60px -15px rgba(226, 129, 143, 0.18)',
                'glass': '0 8px 32px 0 rgba(61, 43, 51, 0.05)'
              },
              transitionTimingFunction: {
                'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
              }
            }
          }
        }