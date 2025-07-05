import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// รายการอุปกรณ์ตรงกับหัวตาราง Google Sheet
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
    const sheetName = 'OKประจำวัน';

    // รับข้อมูลจาก body
    const { date, inspector, counts } = req.body;
    // counts: { [ชื่ออุปกรณ์]: จำนวน }

    // เตรียมข้อมูล 1 แถว: [วันที่, ผู้ตรวจสอบ, ...จำนวนแต่ละอุปกรณ์]
    const row = [date, inspector, ...items.map((name) => counts[name] ?? '')];

    // เพิ่มข้อมูลลง Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row],
      },
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
} 