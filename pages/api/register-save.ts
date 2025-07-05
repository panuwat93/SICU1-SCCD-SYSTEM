import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const credentialsPath = path.join(process.cwd(), 'credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1hawajq8eivRVMm4tm7uVINLSXbG_tW5QCEV4QYK5sCw';
    const sheetName = 'รับของประจำวัน';

    // รับข้อมูลจาก body
    const { registrar, dateReceive, rows } = req.body;
    // rows: Array<{ item: string, expire: string, amount: string }>

    // เตรียมข้อมูลสำหรับเพิ่มลงชีต (แถวละ 1 รายการ)
    // [วันที่รับของ, ชื่ออุปกรณ์, วันหมดอายุ, จำนวนที่รับ, ผู้ลงทะเบียน]
    const values = rows.map((row: any) => [dateReceive, row.item, row.expire, row.amount, registrar]);

    // เพิ่มข้อมูลลง Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:E`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values,
      },
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
} 