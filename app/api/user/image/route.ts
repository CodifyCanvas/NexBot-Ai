// app/api/user/image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import path from 'path';
import fs from 'fs/promises';
import { updateUserProfileImage } from '@/lib/actions/user'; // hypothetical DB update function

// Helper to ensure directory exists
async function ensureDirExists(dirPath: string) {
    try {
        await fs.mkdir(dirPath, { recursive: true });
    } catch (e) {
        // ignore if exists
    }
}

// Parse multipart/form-data
async function parseMultipartFormData(req: NextRequest) {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.startsWith('multipart/form-data')) {
        throw new Error('Content-Type must be multipart/form-data');
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
        throw new Error('No file uploaded');
    }

    return file;
}

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate user
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse multipart form data to get the image file
        const file = await parseMultipartFormData(req);

        // 3. Define upload directory inside /public/uploaded/images/profile
        const uploadDir = path.join(process.cwd(), 'public', 'uploaded', 'images', 'profile');
        await ensureDirExists(uploadDir);

        // 4. Generate filename as before
        const timestamp = Date.now();
        const originalName = file.name.replace(/\s+/g, '_');
        const fileExt = path.extname(originalName);
        const fileName = `user_${userId}_${timestamp}${fileExt}`;
        const filePath = path.join(uploadDir, fileName);

        // 5. Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(filePath, buffer);

        // 6. Store **public URL path** in DB (without "public" prefix)
        const relativePath = `/uploaded/images/profile/${fileName}`;
        await updateUserProfileImage(Number(userId), relativePath);

        // 7. Return success
        return NextResponse.json(
            { message: 'Profile image uploaded successfully', imagePath: relativePath },
            { status: 200 }
        );
    } catch (err) {
        console.error('Error uploading profile image:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
