import { BlobServiceClient } from '@azure/storage-blob';
import { v1 as uuidv1 } from 'uuid';

import multer from 'multer';

const connectionString = 'DefaultEndpointsProtocol=https;AccountName=hich;AccountKey=sYJHI6hQkqzdCR0qoIbbYRbSyuncIRVc3EYIO5iOeJr63UuBzNDoxVqBiOy1mwuebvkdI/xczSQo+ASt2azVjQ==;EndpointSuffix=core.windows.net';
const containerName = 'images';

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);


async function uploadImage(file) {
  const filename = `${uuidv1()}_${file.originalname}`;
  const blockBlobClient = containerClient.getBlockBlobClient(filename);

  await blockBlobClient.uploadData(file.buffer, {
    blobHTTPHeaders: { blobContentType: file.mimetype },
  });

  const imageUrl = blockBlobClient.url;

  return imageUrl;
}


const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});


export { uploadImage  , upload};
