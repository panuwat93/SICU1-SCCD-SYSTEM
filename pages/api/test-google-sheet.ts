import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // โหลด credentials
    const credentialsPath = path.join(process.cwd(), 'credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

    // สร้าง client
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // spreadsheetId ของคุณ
    const spreadsheetId = '1hawajq8eivRVMm4tm7uVINLSXbG_tW5QCEV4QYK5sCw';

    // อ่านข้อมูลจากชีตแรก (OKประจำวัน)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'OKประจำวัน!A1:E10', // ตัวอย่างช่วงข้อมูล
    });

    res.status(200).json({ data: response.data.values });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
} 