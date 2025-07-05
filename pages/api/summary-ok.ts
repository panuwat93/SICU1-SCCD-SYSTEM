import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { month, year } = req.query;
    const m = Number(month);
    const y = Number(year);
    if (!m || !y) return res.status(400).json({ error: 'month and year required' });

    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT as string);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1hawajq8eivRVMm4tm7uVINLSXbG_tW5QCEV4QYK5sCw';
    const sheetName = 'OKประจำวัน';

    // ดึงข้อมูลทั้งหมด (A1:AF1000)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:AF1000`,
    });
    const values = response.data.values || [];
    // หาตำแหน่งคอลัมน์วันที่/ผู้ตรวจสอบ
    const header = values[0] || [];
    const dateIdx = header.findIndex((h) => h.includes('วันที่'));
    const inspectorIdx = header.findIndex((h) => h.includes('ผู้ตรวจสอบ'));
    // ข้าม header
    const data = values.slice(1)
      .map((row) => ({
        date: row[dateIdx] || '',
        inspector: row[inspectorIdx] || '',
      }))
      .filter((row) => {
        const d = dayjs(row.date);
        return d.isValid() && d.month() + 1 === m && d.year() === y;
      });
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
} 