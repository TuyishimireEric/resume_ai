import { google } from 'googleapis';
import { Readable } from 'stream';

export async function uploadToGoogleDrive(file: File) {
  try {
    // Initialize the Google Drive API client
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    //   process.env.GOOGLE_REDIRECT_URI
    );
    
    // // Set credentials using refresh token
    // auth.setCredentials({
    //   refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    // });
    
    const drive = google.drive({ version: 'v3', auth });
    
    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Create a readable stream from the buffer
    const fileStream = new Readable();
    fileStream.push(buffer);
    fileStream.push(null);
    
    // Set up the request metadata
    const fileMetadata = {
      name: file.name || 'resume.pdf',
      mimeType: 'application/pdf'
    };
    
    // Set up the media
    const media = {
      mimeType: 'application/pdf',
      body: fileStream
    };
    
    // Upload the file to Google Drive
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id,webViewLink,webContentLink',
    });
    
    // Make the file publicly accessible (anyone with the link can view)
    await drive.permissions.create({
      fileId: response.data.id!,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });
    
    return {
      id: response.data.id,
      viewUrl: response.data.webViewLink,
      downloadUrl: response.data.webContentLink
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
}