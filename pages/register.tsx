import { useState } from 'react';
import { Button, Container, Typography, Box, Grid, TextField, MenuItem, Paper, IconButton, Snackbar, Alert, InputAdornment } from '@mui/material';
import { Kanit } from 'next/font/google';
import dayjs from 'dayjs';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import Link from 'next/link';
import Autocomplete from '@mui/material/Autocomplete';

const kanit = Kanit({ subsets: ['thai', 'latin'], weight: ['400', '700'] });

const items = [
  'Ambu เด็กเล็ก',
  'Ambu เด็กโต',
  'Ambu ผู้ใหญ่',
  'กรรไกรตัดไหม',
  'กรรไกรตัดเนื้อ',
  'ไม้กดลิ้น',
  'Artery clamp โค้ง',
  'Artery clamp ตรง',
  'ด้ามมีด',
  'Needle Holder',
  'Off staple',
  'Set H/C',
  'Syringe Feed',
  'Set เจาะปอด',
  'Set Cut Down',
  'Set Arrigate',
  'Set Dressing',
  'Set Suture Ward',
  'Set เก็บดวงตา',
  'Set Flush',
  'Set สวนปัสสาวะ',
  'ผ้า 180 วัน',
  'ผ้าเจาะกลาง',
  'ถาดเล็ก',
  'กาวน์ Sterile',
  'Tray',
  'ขวด ICD',
  'ชุดต่อ ICD 1 ขวด',
  'ชุดต่อ ICD 2 ขวด',
  'ชุดต่อ ICD 3 ขวด',
];

const registrars = [
  'ภาณุวัฒน์',
  'สุกัญญา',
  'ณัทชกา',
  'ดวงแก้ว',
  'อรอุษา',
  'อัมพร',
];

interface RegisterRow {
  item: string;
  expire: string;
  amount: string;
}

export default function Register() {
  const [rows, setRows] = useState<RegisterRow[]>([
    { item: '', expire: '', amount: '' },
  ]);
  const [registrar, setRegistrar] = useState('');
  const [dateReceive, setDateReceive] = useState(dayjs().format('YYYY-MM-DD'));
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const handleRowChange = (idx: number, field: keyof RegisterRow, value: string) => {
    setRows((prev) => prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  };

  const handleAddRow = () => {
    setRows((prev) => [...prev, { item: '', expire: '', amount: '' }]);
  };

  const handleRemoveRow = (idx: number) => {
    setRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/register-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrar, dateReceive, rows }),
      });
      if (res.ok) {
        setSnackbar({ open: true, message: 'บันทึกข้อมูลเรียบร้อย', severity: 'success' });
        setRows([{ item: '', expire: '', amount: '' }]);
        setRegistrar('');
      } else {
        const data = await res.json();
        setSnackbar({ open: true, message: data.error || 'เกิดข้อผิดพลาด', severity: 'error' });
      }
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'เกิดข้อผิดพลาด', severity: 'error' });
    }
  };

  return (
    <Box className={kanit.className} sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, mb: 3, borderRadius: 4, bgcolor: '#fff' }}>
          <Typography variant="h4" fontWeight={700} align="center" sx={{ letterSpacing: 1, color: 'primary.main', mb: 3 }}>
            ลงทะเบียนรับของประจำวัน
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center" justifyContent="center">
              <Grid item xs={12} md={4}>
                <TextField
                  label="ชื่อผู้ลงทะเบียน"
                  select
                  value={registrar}
                  onChange={(e) => setRegistrar(e.target.value)}
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
                  {registrars.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="วันที่รับ"
                  type="date"
                  value={dateReceive}
                  onChange={(e) => setDateReceive(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                  sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
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
                      <th style={{ padding: 12, fontWeight: 700, fontSize: 19, color: '#1976d2' }}>วันหมดอายุ</th>
                      <th style={{ padding: 12, fontWeight: 700, fontSize: 19, color: '#1976d2' }}>จำนวนที่รับ</th>
                      <th style={{ padding: 12 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: 8, minWidth: 200 }}>
                          <Autocomplete
                            options={items}
                            value={row.item}
                            onChange={(_, value) => handleRowChange(idx, 'item', value || '')}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="เลือกอุปกรณ์"
                                required
                                size="small"
                                sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}
                              />
                            )}
                            fullWidth
                            disableClearable
                            autoHighlight
                          />
                        </td>
                        <td style={{ padding: 8, minWidth: 150 }}>
                          <TextField
                            label="วันหมดอายุ"
                            type="date"
                            value={row.expire}
                            onChange={(e) => handleRowChange(idx, 'expire', e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            required
                            size="small"
                            sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}
                          />
                        </td>
                        <td style={{ padding: 8, minWidth: 100 }}>
                          <TextField
                            label="จำนวน"
                            type="number"
                            value={row.amount}
                            onChange={(e) => handleRowChange(idx, 'amount', e.target.value)}
                            fullWidth
                            required
                            size="small"
                            inputProps={{ min: 1, style: { fontSize: 18, width: 80 } }}
                            sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}
                          />
                        </td>
                        <td style={{ padding: 8 }}>
                          <IconButton color="error" onClick={() => handleRemoveRow(idx)} disabled={rows.length === 1}>
                            <RemoveCircleIcon />
                          </IconButton>
                          {idx === rows.length - 1 && (
                            <IconButton color="primary" onClick={handleAddRow}>
                              <AddCircleIcon />
                            </IconButton>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Paper>
            </Box>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button type="submit" variant="contained" size="large" sx={{ fontSize: 20, px: 6, borderRadius: 3 }}>
                บันทึกลง Google Sheet
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