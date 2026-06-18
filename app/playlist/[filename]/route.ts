import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  
  // Basic security check
  if (!filename || filename.includes('..') || filename.includes('/')) {
    return new NextResponse('Invalid filename', { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'app', 'data', filename);

  try {
    if (!fs.existsSync(filePath)) {
      return new NextResponse('Playlist not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const stat = fs.statSync(filePath);

    const ext = path.extname(filename).toLowerCase();
    let contentType = 'text/plain';

    if (ext === '.json') {
      contentType = 'application/json';
    } else if (ext === '.m3u' || ext === '.m3u8') {
      contentType = 'application/vnd.apple.mpegurl';
    }

    const response = new NextResponse(fileBuffer);
    response.headers.set('Content-Type', contentType);
    response.headers.set('Content-Length', stat.size.toString());
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
    response.headers.set('Access-Control-Allow-Origin', '*');
    
    return response;
  } catch (error) {
    console.error('Error reading playlist file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
