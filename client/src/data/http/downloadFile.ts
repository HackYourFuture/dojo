import axios from 'axios';

// The name the server gave the file, from `Content-Disposition: attachment; filename="trainees-2026-10-29.csv"`.
const filenameFromHeader = (contentDisposition: unknown, fallbackName: string) => {
  if (typeof contentDisposition !== 'string') {
    return fallbackName;
  }
  const marker = 'filename="';
  const markerIndex = contentDisposition.indexOf(marker);
  if (markerIndex === -1) {
    return fallbackName;
  }
  const nameStart = markerIndex + marker.length;
  const nameEnd = contentDisposition.indexOf('"', nameStart);
  if (nameEnd === -1) {
    return fallbackName;
  }
  return contentDisposition.substring(nameStart, nameEnd);
};

/** Downloads a file through axios, so an expired access token is renewed like for any other request, then saves it. */
export const downloadFile = async (url: string, params: object, fallbackName: string) => {
  const response = await axios.get<Blob>(url, { params, paramsSerializer: { indexes: null }, responseType: 'blob' });
  const filename = filenameFromHeader(response.headers['content-disposition'], fallbackName);

  const objectUrl = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  link.click();
  // Revoked later, not now: Firefox may not have read the blob yet when the click returns.
  setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
};
