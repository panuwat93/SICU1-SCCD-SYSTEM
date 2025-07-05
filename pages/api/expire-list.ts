import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
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
    // ข้าม header (row 1)
    const data = values.slice(1).map((row) => ({
      dateReceive: row[0] || '',
      item: row[1] || '',
      expire: row[2] || '',
      amount: row[3] || '',
      registrar: row[4] || '',
    }));
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
} 