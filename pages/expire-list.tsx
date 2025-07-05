import { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { Kanit } from 'next/font/google';
import dayjs from 'dayjs';

const kanit = Kanit({ subsets: ['thai', 'latin'], weight: ['400', '700'] });

interface ExpireRow {
  dateReceive: string;
  item: string;
  expire: string;
  amount: string;
  registrar: string;
}

function getRowColor(expire: string) {
  if (!expire) return '';
  const today = dayjs().startOf('day');
  const exp = dayjs(expire);
  if (!exp.isValid()) return '';
  const diff = exp.diff(today, 'day');
  if (diff < 0) return '#ffebee'; // แดง หมดอายุ
  if (diff < 3) return '#ffe0b2'; // ส้ม <3 วัน
  if (diff < 5) return '#fffde7'; // เหลือง <5 วัน
  return '';
}

function excelSerialToDate(serial: string) {
  const n = Number(serial);
  if (isNaN(n)) return serial;
  // Excel/Google Sheets serial: 1 = 1899-12-31, แต่ Google Sheets ใช้ 1899-12-30
  const utc_days = n - 25569; // 25569 = days from 1899-12-30 to 1970-01-01
  const utc_value = utc_days * 86400;
  const d = new Date(utc_value * 1000);
  return dayjs(d).format('YYYY-MM-DD');
}

export default function ExpireList() {
  const [rows, setRows] = useState<ExpireRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/expire-list')
      .then((res) => res.json())
      .then((data) => setRows(data.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box className={kanit.className} sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, mb: 3, borderRadius: 4, bgcolor: '#fff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h4" fontWeight={700} align="center" sx={{ flex: 1, letterSpacing: 1, color: 'primary.main' }}>
              รายการของใกล้หมดอายุและหมดอายุ
            </Typography>
            <Link href="/" passHref legacyBehavior>
              <Button startIcon={<ArrowBackIcon />} variant="contained" color="primary" sx={{ fontWeight: 700, borderRadius: 2, minWidth: 0, px: 4, boxShadow: 2, height: 56, ml: 2 }}>
                กลับหน้าหลัก
              </Button>
            </Link>
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ overflowX: 'auto', mt: 2 }}>
              <Paper elevation={2} sx={{ borderRadius: 3, bgcolor: '#f5fafe' }}>
                <Table sx={{ minWidth: 650, fontSize: 18 }}>
                  <TableHead>
                    <TableRow sx={{ background: '#e3f2fd' }}>
                      <TableCell sx={{ fontWeight: 700, fontSize: 19, color: '#1976d2' }}>ชื่ออุปกรณ์</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 19, color: '#1976d2' }}>วันหมดอายุ</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 19, color: '#1976d2' }}>จำนวน</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 19, color: '#1976d2' }}>ผู้ลงทะเบียน</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 19, color: '#1976d2' }}>วันที่รับของ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, idx) => (
                      <TableRow key={idx} sx={{ background: getRowColor(row.expire) }}>
                        <TableCell sx={{ fontSize: 18 }}>{row.item}</TableCell>
                        <TableCell sx={{ fontSize: 18 }}>{excelSerialToDate(row.expire)}</TableCell>
                        <TableCell sx={{ fontSize: 18 }}>{row.amount}</TableCell>
                        <TableCell sx={{ fontSize: 18 }}>{row.registrar}</TableCell>
                        <TableCell sx={{ fontSize: 18 }}>{row.dateReceive}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
} 