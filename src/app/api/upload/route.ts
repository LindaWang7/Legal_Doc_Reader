import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';

const UPLOAD_DIR = 'uploads';

export async function POST(request: NextRequest) {
  try {
    // Ensure upload directory exists
    const uploadPath = join(process.cwd(), UPLOAD_DIR);
    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true });
    }

    const formData = await request.formData();
    const file = formData.get('document') as File;

    if (!file) {
      console.error('No file received in request');
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Log file details
    console.log('Received file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validate file type
    if (!file.type.match('application/pdf|application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload PDF or DOCX files only.' },
        { status: 400 }
      );
    }

    // Create unique filename
    const documentId = uuidv4();
    const ext = file.name.split('.').pop();
    const fileName = `${documentId}.${ext}`;
    const filePath = join(uploadPath, fileName);

    // Convert File to Buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      await writeFile(filePath, buffer);
      console.log('File saved successfully:', filePath);
    } catch (error) {
      console.error('Error saving file:', error);
      return NextResponse.json(
        { success: false, error: 'Error saving file' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      documentId,
      fileName
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 