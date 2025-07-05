import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import dayjs from 'dayjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { month, year } = req.query;
    const m = Number(month);
    const y = Number(year);
    if (!m || !y) return res.status(400).json({ error: 'month and year required' });

    if (!process.env.GOOGLE_SERVICE_ACCOUNT) {
      return res.status(500).json({ error: 'Missing GOOGLE_SERVICE_ACCOUNT' });
    }

    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT as string);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1hawajq8eivRVMm4tm7uVINLSXbG_tW5QCEV4QYK5sCw';
    const sheetName = 'รับของประจำวัน';

    // ดึงข้อมูลทั้งหมด (A1:E1000)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:E1000`,
    });
    const values = response.data.values || [];
    // หาตำแหน่งคอลัมน์วันที่รับของ, ชื่ออุปกรณ์, จำนวน
    const header = values[0] || [];
    const dateIdx = header.findIndex((h) => h.includes('วันที่'));
    const itemIdx = header.findIndex((h) => h.includes('ชื่ออุปกรณ์'));
    const amountIdx = header.findIndex((h) => h.includes('จำนวน'));
    // ข้าม header
    const filtered = values.slice(1).filter((row) => {
      const d = dayjs(row[dateIdx]);
      return d.isValid() && d.month() + 1 === m && d.year() === y;
    });
    // รวมจำนวนแต่ละอุปกรณ์
    const summary: Record<string, number> = {};
    filtered.forEach((row) => {
      const item = row[itemIdx] || '';
      const amount = Number(row[amountIdx] || 0);
      if (!item) return;
      summary[item] = (summary[item] || 0) + amount;
    });
    const data = Object.entries(summary).map(([item, total]) => ({ item, total }));
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}