import { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, Button, MenuItem, Select, FormControl, InputLabel, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Stack } from '@mui/material';
import { Kanit } from 'next/font/google';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

const kanit = Kanit({ subsets: ['thai', 'latin'], weight: ['400', '700'] });

const thisYear = dayjs().year();
const thisMonth = dayjs().month() + 1;
const years = Array.from({ length: 6 }, (_, i) => thisYear - 3 + i); // 3 ปีย้อนหลังถึง 2 ปีข้างหน้า
const months = [
  { value: 1, label: 'มกราคม' },
  { value: 2, label: 'กุมภาพันธ์' },
  { value: 3, label: 'มีนาคม' },
  { value: 4, label: 'เมษายน' },
  { value: 5, label: 'พฤษภาคม' },
  { value: 6, label: 'มิถุนายน' },
  { value: 7, label: 'กรกฎาคม' },
  { value: 8, label: 'สิงหาคม' },
  { value: 9, label: 'กันยายน' },
  { value: 10, label: 'ตุลาคม' },
  { value: 11, label: 'พฤศจิกายน' },
  { value: 12, label: 'ธันวาคม' },
];

export default function Summary() {
  const [month, setMonth] = useState(thisMonth);
  const [year, setYear] = useState(thisYear);
  const [mode, setMode] = useState<'ok' | 'register'>('ok');
  const [okRows, setOkRows] = useState<{ date: string; inspector: string }[]>([]);
  const [okLoading, setOkLoading] = useState(false);
  const [registerRows, setRegisterRows] = useState<{ item: string; total: number }[]>([]);
  const [registerLoading, setRegisterLoading] = useState(false);

  useEffect(() => {
    if (mode === 'ok') {
      setOkLoading(true);
      fetch(`/api/summary-ok?month=${month}&year=${year}`)
        .then((res) => res.json())
        .then((data) => setOkRows(data.data || []))
        .finally(() => setOkLoading(false));
    }
  }, [mode, month, year]);

  useEffect(() => {
    if (mode === 'register') {
      setRegisterLoading(true);
      fetch(`/api/summary-register?month=${month}&year=${year}`)
        .then((res) => res.json())
        .then((data) => setRegisterRows(data.data || []))
        .finally(() => setRegisterLoading(false));
    }
  }, [mode, month, year]);

  // สร้าง array วันที่ทุกวันในเดือนนั้น
  const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
  const allDates = Array.from({ length: daysInMonth }, (_, i) => dayjs(`${year}-${month}-${i + 1}`).format('YYYY-MM-DD'));
  // map วันที่กับผู้ตรวจสอบ
  const okTable = allDates.map((date) => ({
    date,
    inspector: okRows.find((row) => dayjs(row.date).isSame(date, 'day'))?.inspector || '',
  }));

  // ฟังก์ชัน export Excel ตรวจสอบประจำเดือน
  const handleExportOk = () => {
    const ws = XLSX.utils.json_to_sheet(
      okTable.map((row) => ({
        'วันที่': dayjs(row.date).format('YYYY-MM-DD'),
        'ผู้ตรวจสอบ': row.inspector,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ตรวจสอบประจำเดือน');
    XLSX.writeFile(wb, `ตรวจสอบประจำเดือน_${year}_${month}.xlsx`);
  };
  // ฟังก์ชัน export Excel ลงทะเบียนรับของประจำเดือน
  const handleExportRegister = () => {
    const ws = XLSX.utils.json_to_sheet(
      registerRows.map((row) => ({
        'รายการอุปกรณ์': row.item,
        'จำนวน': row.total,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ลงทะเบียนรับของ');
    XLSX.writeFile(wb, `ลงทะเบียนรับของ_${year}_${month}.xlsx`);
  };

  return (
    <Box className={kanit.className} sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ p: { xs: 1, md: 4 }, mb: 3, borderRadius: 4, bgcolor: '#fff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Typography variant="h4" fontWeight={700} align="center" sx={{ flex: 1, letterSpacing: 1, color: 'primary.main', fontSize: { xs: '1.2rem', sm: '2rem', md: '2.5rem' }, wordBreak: 'keep-all' }}>
              สรุปประจำเดือน
            </Typography>
          </Box>
          <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center" justifyContent="center" sx={{ mb: 3 }}>
            <Grid item xs={6} sm="auto">
              <FormControl size="medium" fullWidth>
                <InputLabel>เดือน</InputLabel>
                <Select
                  value={month}
                  label="เดือน"
                  onChange={(e) => setMonth(Number(e.target.value))}
                  sx={{ minWidth: { xs: 80, sm: 140 }, fontSize: { xs: 14, sm: 18 }, borderRadius: 2, bgcolor: '#f5fafe', height: 44 }}
                >
                  {months.map((m) => (
                    <MenuItem key={m.value} value={m.value} sx={{ fontSize: { xs: 14, sm: 18 } }}>{m.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm="auto">
              <FormControl size="medium" fullWidth>
                <InputLabel>ปี</InputLabel>
                <Select
                  value={year}
                  label="ปี"
                  onChange={(e) => setYear(Number(e.target.value))}
                  sx={{ minWidth: { xs: 60, sm: 120 }, fontSize: { xs: 14, sm: 18 }, borderRadius: 2, bgcolor: '#f5fafe', height: 44 }}
                >
                  {years.map((y) => (
                    <MenuItem key={y} value={y} sx={{ fontSize: { xs: 14, sm: 18 } }}>{y + 543}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm="auto" sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button
                  variant={mode === 'ok' ? 'contained' : 'outlined'}
                  onClick={() => setMode('ok')}
                  sx={{ fontWeight: 700, fontSize: { xs: 14, sm: 18 }, borderRadius: 2, px: { xs: 2, sm: 4 }, height: 40, width: { xs: '100%', sm: 'auto' } }}
                >
                  ตรวจสอบประจำเดือน
                </Button>
                <Button
                  variant={mode === 'register' ? 'contained' : 'outlined'}
                  onClick={() => setMode('register')}
                  sx={{ fontWeight: 700, fontSize: { xs: 14, sm: 18 }, borderRadius: 2, px: { xs: 2, sm: 4 }, height: 40, width: { xs: '100%', sm: 'auto' } }}
                >
                  ลงทะเบียนรับของประจำเดือน
                </Button>
              </Stack>
            </Grid>
          </Grid>
          {/* ตารางสรุป */}
          {mode === 'ok' ? (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 0 } }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontSize: { xs: 16, sm: 20 }, fontWeight: 600 }}>
                  ตารางตรวจสอบประจำเดือน
                </Typography>
                <Link href="/" passHref legacyBehavior>
                  <Button startIcon={<ArrowBackIcon />} variant="contained" color="primary" sx={{ fontWeight: 700, borderRadius: 2, minWidth: 0, px: { xs: 0, sm: 4 }, boxShadow: 2, height: 36, width: { xs: '100%', sm: 'auto' }, fontSize: { xs: 14, sm: 17 } }}>
                    กลับหน้าหลัก
                  </Button>
                </Link>
              </Box>
              <Button variant="outlined" sx={{ mb: 2, fontSize: { xs: 14, sm: 18 }, borderRadius: 2, px: { xs: 2, sm: 4 }, height: 36, width: { xs: '100%', sm: 'auto' } }} onClick={handleExportOk}>Export Excel</Button>
              {okLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
              ) : (
                <Box sx={{ overflowX: 'auto' }}>
                  <Paper elevation={2} sx={{ borderRadius: 3, bgcolor: '#f5fafe' }}>
                    <Table sx={{ minWidth: 400, fontSize: { xs: 13, sm: 16, md: 18 } }}>
                      <TableHead>
                        <TableRow sx={{ background: '#e3f2fd' }}>
                          <TableCell sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 19 }, color: '#1976d2', py: 1 }}>วันที่</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 19 }, color: '#1976d2', py: 1 }}>ผู้ตรวจสอบ</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {okTable.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ fontSize: { xs: 13, sm: 18 }, py: 1 }}>{dayjs(row.date).format('YYYY-MM-DD')}</TableCell>
                            <TableCell sx={{ fontSize: { xs: 13, sm: 18 }, py: 1 }}>{row.inspector}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 0 } }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontSize: { xs: 16, sm: 20 }, fontWeight: 600 }}>
                  ตารางลงทะเบียนรับของประจำเดือน
                </Typography>
                <Link href="/" passHref legacyBehavior>
                  <Button startIcon={<ArrowBackIcon />} variant="contained" color="primary" sx={{ fontWeight: 700, borderRadius: 2, minWidth: 0, px: { xs: 0, sm: 4 }, boxShadow: 2, height: 36, width: { xs: '100%', sm: 'auto' }, fontSize: { xs: 14, sm: 17 } }}>
                    กลับหน้าหลัก
                  </Button>
                </Link>
              </Box>
              <Button variant="outlined" sx={{ mb: 2, fontSize: { xs: 14, sm: 18 }, borderRadius: 2, px: { xs: 2, sm: 4 }, height: 36, width: { xs: '100%', sm: 'auto' } }} onClick={handleExportRegister}>Export Excel</Button>
              {registerLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
              ) : (
                <Box sx={{ overflowX: 'auto' }}>
                  <Paper elevation={2} sx={{ borderRadius: 3, bgcolor: '#f5fafe' }}>
                    <Table sx={{ minWidth: 400, fontSize: { xs: 13, sm: 16, md: 18 } }}>
                      <TableHead>
                        <TableRow sx={{ background: '#e3f2fd' }}>
                          <TableCell sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 19 }, color: '#1976d2', py: 1 }}>รายการอุปกรณ์</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 19 }, color: '#1976d2', py: 1 }}>จำนวน</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {registerRows.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ fontSize: { xs: 13, sm: 18 }, py: 1 }}>{row.item}</TableCell>
                            <TableCell sx={{ fontSize: { xs: 13, sm: 18 }, py: 1 }}>{row.total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
} 