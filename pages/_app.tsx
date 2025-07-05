import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Kanit } from 'next/font/google';

const kanit = Kanit({ subsets: ['thai', 'latin'], weight: ['400', '700'] });

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // ฟ้าเข้ม
    },
    secondary: {
      main: '#43a047', // เขียว
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: kanit.style.fontFamily,
    fontSize: 18,
    h5: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    button: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontSize: 20,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: 18,
        },
        head: {
          fontWeight: 700,
          fontSize: 19,
        },
      },
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main className={kanit.className}>
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
  );
} 