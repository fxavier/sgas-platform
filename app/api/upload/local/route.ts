import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Function to ensure the uploads directory exists
const ensureUploadsDir = () => {
  const uploadsDir = path.join(process.cwd(), 'public/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log(
      'Received file for local upload:',
      file.name,
      file.size,
      file.type
    );

    // Instead of uploading to S3, save locally for testing
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename while preserving original extension
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;

    // Ensure directory exists
    const uploadsDir = ensureUploadsDir();
    const filePath = path.join(uploadsDir, fileName);

    // Write file to local filesystem
    fs.writeFileSync(filePath, new Uint8Array(buffer));

    // Create a URL that can be accessed by the browser
    const fileUrl = `/uploads/${fileName}`;

    console.log('File saved locally:', filePath);
    console.log('Public URL:', fileUrl);

    // Return the file URL
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Error handling local file upload:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: String(error) },
      { status: 500 }
    );
  }
}
