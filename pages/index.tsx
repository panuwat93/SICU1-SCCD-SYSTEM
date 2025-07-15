import { Button, Container, Typography, Box, Stack, Paper } from '@mui/material';
import { Kanit } from 'next/font/google';
import Link from 'next/link';

const kanit = Kanit({ subsets: ['thai', 'latin'], weight: ['400', '700'] });

export default function Home() {
  return (
    <Box
      className={kanit.className}
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm" sx={{ mt: { xs: 2, sm: 6 }, mb: { xs: 2, sm: 4 }, p: { xs: 1, sm: 2 } }}>
        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          gutterBottom
          sx={{
            letterSpacing: 1,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            wordBreak: 'keep-all',
          }}
        >
          SICU1 CSSD SYSTEM
        </Typography>
        <Typography
          variant="h5"
          align="center"
          fontWeight={400}
          gutterBottom
          sx={{
            letterSpacing: 0.5,
            mb: { xs: 2, sm: 3 },
            color: 'primary.main',
            fontSize: { xs: '1.1rem', sm: '1.5rem' },
          }}
        >
          ระบบตรวจสอบของสะอาด ICU ศัลยกรรม 1
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          gutterBottom
          sx={{ mb: { xs: 2, sm: 4 }, fontSize: { xs: '1rem', sm: '1.2rem' } }}
        >
          เลือกเมนูที่ต้องการ
        </Typography>
        <Stack spacing={{ xs: 2, sm: 3 }} alignItems="center">
          <Link href="/ok-check" passHref legacyBehavior>
            <Button
              fullWidth
              size="large"
              variant="contained"
              sx={{
                fontSize: { xs: 16, sm: 22 },
                py: { xs: 1.5, sm: 2.5 },
                bgcolor: '#388e3c',
                boxShadow: 3,
                maxWidth: { xs: '100%', sm: 400 },
                fontWeight: 700,
                transition: 'transform 0.1s',
                ':hover': { bgcolor: '#2e7031', transform: 'scale(1.04)' },
              }}
            >
              1. OK ของประจำวัน
            </Button>
          </Link>

          {/*
          <Link href="/register" passHref legacyBehavior>
            <Button
              fullWidth
              size="large"
              variant="contained"
              sx={{
                fontSize: { xs: 16, sm: 22 },
                py: { xs: 1.5, sm: 2.5 },
                bgcolor: '#1976d2',
                boxShadow: 3,
                maxWidth: { xs: '100%', sm: 400 },
                fontWeight: 700,
                transition: 'transform 0.1s',
                ':hover': { bgcolor: '#115293', transform: 'scale(1.04)' },
              }}
            >
              2. ลงทะเบียนรับของประจำวัน
            </Button>
          </Link>
          <Link href="/expire-list" passHref legacyBehavior>
            <Button
              fullWidth
              size="large"
              variant="contained"
              sx={{
                fontSize: { xs: 16, sm: 22 },
                py: { xs: 1.5, sm: 2.5 },
                bgcolor: '#fbc02d',
                color: '#222',
                boxShadow: 3,
                maxWidth: { xs: '100%', sm: 400 },
                fontWeight: 700,
                transition: 'transform 0.1s',
                ':hover': { bgcolor: '#f9a825', transform: 'scale(1.04)' },
              }}
            >
              3. รายการของใกล้หมดอายุและหมดอายุ
            </Button>
          </Link>
          */}

          <Link href="/summary" passHref legacyBehavior>
            <Button
              fullWidth
              size="large"
              variant="contained"
              sx={{
                fontSize: { xs: 16, sm: 22 },
                py: { xs: 1.5, sm: 2.5 },
                bgcolor: '#8e24aa',
                boxShadow: 3,
                maxWidth: { xs: '100%', sm: 400 },
                fontWeight: 700,
                transition: 'transform 0.1s',
                ':hover': { bgcolor: '#6d1b7b', transform: 'scale(1.04)' },
              }}
            >
              2. สรุปประจำเดือน
            </Button>
          </Link>
        </Stack>
      </Container>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: { xs: 2, sm: 4 } }}>
        create by Panuwat Inkeaw
      </Typography>
    </Box>
  );
} 