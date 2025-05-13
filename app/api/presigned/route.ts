import { NextResponse } from 'next/server';
import { getPresignedUrl } from '@/lib/s3-service';

export async function POST(request: Request) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json({ message: 'Key is required' }, { status: 400 });
    }

    const url = await getPresignedUrl(key);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json(
      { message: 'Failed to generate presigned URL' },
      { status: 500 }
    );
  }
}
