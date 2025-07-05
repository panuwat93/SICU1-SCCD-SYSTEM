import { useState } from 'react';
import { Button, Container, Typography, Box, Grid, TextField, MenuItem, Paper, Snackbar, Alert, Stack, InputAdornment } from '@mui/material';
import { Kanit } from 'next/font/google';
import dayjs from 'dayjs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import Link from 'next/link';

const kanit = Kanit({ subsets: ['thai', 'latin'], weight: ['400', '700'] });

// รายการอุปกรณ์และ stock ที่ตั้งไว้
const items = [
  { name: 'Ambu เด็กเล็ก', stock: 1 },
  { name: 'Ambu เด็กโต', stock: 1 },
  { name: 'Ambu ผู้ใหญ่', stock: 11 },
  { name: 'กรรไกรตัดไหม', stock: 5 },
  { name: 'กรรไกรตัดเนื้อ', stock: 5 },
  { name: 'ไม้กดลิ้น', stock: 2 },
  { name: 'Artery clamp โค้ง', stock: 2 },
  { name: 'Artery clamp ตรง', stock: 2 },
  { name: 'ด้ามมีด', stock: 1 },
  { name: 'Needle Holder', stock: 1 },
  { name: 'Off staple', stock: 1 },
  { name: 'Set H/C', stock: 6 },
  { name: 'Syringe Feed', stock: 30 },
  { name: 'Set เจาะปอด', stock: 2 },
  { name: 'Set Cut Down', stock: 3 },
  { name: 'Set Arrigate', stock: 3 },
  { name: 'Set Dressing', stock: 15 },
  { name: 'Set Suture Ward', stock: 1 },
  { name: 'Set เก็บดวงตา', stock: 1 },
  { name: 'Set Flush', stock: 22 },
  { name: 'Set สวนปัสสาวะ', stock: 2 },
  { name: 'ผ้า 180 วัน', stock: 1 },
  { name: 'ผ้าเจาะกลาง', stock: 3 },
  { name: 'ถาดเล็ก', stock: 1 },
  { name: 'กาวน์ Sterile', stock: 3 },
  { name: 'Tray', stock: 1 },
  { name: 'ขวด ICD', stock: 9 },
  { name: 'ชุดต่อ ICD 1 ขวด', stock: 2 },
  { name: 'ชุดต่อ ICD 2 ขวด', stock: 4 },
  { name: 'ชุดต่อ ICD 3 ขวด', stock: 4 },
];

const inspectors = [
  'ภาณุวัฒน์',
  'สุกัญญา',
  'ณัทชกา',
  'ดวงแก้ว',
  'อรอษา',
  'อัมพร',
];

export default function OkCheck() {
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [inspector, setInspector] = useState('');
  const [counts, setCounts] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const handleCountChange = (name: string, value: string) => {
    setCounts((prev) => ({ ...prev, [name]: value }));
  };

  const getColor = (name: string) => {
    const stock = items.find((i) => i.name === name)?.stock ?? 0;
    const count = parseInt(counts[name] || '');
    if (isNaN(count)) return '';
    if (count < stock) return '#fffde7'; // เหลือง
    if (count === stock) return '#e8f5e9'; // เขียว
    if (count > stock) return '#ffebee'; // แดง
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/ok-check-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, inspector, counts }),
      });
      if (res.ok) {
        setSnackbar({ open: true, message: 'บันทึกข้อมูลเรียบร้อย', severity: 'success' });
        setCounts({});
        setInspector('');
      } else {
        const data = await res.json();
        setSnackbar({ open: true, message: data.error || 'เกิดข้อผิดพลาด', severity: 'error' });
      }
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'เกิดข้อผิดพลาด', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={kanit.className} sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, mb: 3, borderRadius: 4, bgcolor: '#fff' }}>
          <Typography variant="h4" fontWeight={700} align="center" sx={{ letterSpacing: 1, color: 'primary.main', mb: 3 }}>
            OK ของประจำวัน
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center" justifyContent="center">
              <Grid item xs={12} md={3}>
                <TextField
                  label="วันที่ตรวจสอบ"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                  sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="ชื่อผู้ตรวจสอบ"
                  select
                  value={inspector}
                  onChange={(e) => setInspector(e.target.value)}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" fontSize="medium" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ bgcolor: '#fff', borderRadius: 2, minWidth: 220, boxShadow: 1 }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: { minWidth: 220 },
                      },
                    },
                  }}
                >
                  {inspectors.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
                <Link href="/" passHref legacyBehavior>
                  <Button startIcon={<ArrowBackIcon />} variant="contained" color="primary" sx={{ fontWeight: 700, borderRadius: 2, minWidth: 0, px: 4, boxShadow: 2, height: 56 }}>
                    กลับหน้าหลัก
                  </Button>
                </Link>
              </Grid>
            </Grid>
            <Box sx={{ overflowX: 'auto', mt: 3 }}>
              <Paper elevation={2} sx={{ borderRadius: 3, bgcolor: '#f5fafe' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 18 }}>
                  <thead>
                    <tr style={{ background: '#e3f2fd' }}>
                      <th style={{ padding: 12, fontWeight: 700, fontSize: 19, color: '#1976d2' }}>ชื่ออุปกรณ์</th>
                      <th style={{ padding: 12, fontWeight: 700, fontSize: 19, color: '#1976d2' }}>จำนวน Stock</th>
                      <th style={{ padding: 12, fontWeight: 700, fontSize: 19, color: '#1976d2' }}>จำนวนที่นับ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.name} style={{ background: getColor(item.name) }}>
                        <td style={{ padding: 10 }}>{item.name}</td>
                        <td style={{ padding: 10, textAlign: 'center', fontWeight: 700, color: '#1976d2' }}>{item.stock}</td>
                        <td style={{ padding: 10, textAlign: 'center' }}>
                          <TextField
                            type="number"
                            inputProps={{ min: 0, style: { fontSize: 18, width: 80 } }}
                            value={counts[item.name] || ''}
                            onChange={(e) => handleCountChange(item.name, e.target.value)}
                            required
                            sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Paper>
            </Box>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button type="submit" variant="contained" size="large" sx={{ fontSize: 20, px: 6, borderRadius: 3 }} disabled={loading}>
                {loading ? 'กำลังบันทึก...' : 'บันทึกลง Google Sheet'}
              </Button>
            </Box>
          </form>
        </Paper>
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
} 