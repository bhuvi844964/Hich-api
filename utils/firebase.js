import dotenv from "dotenv";
import admin from "firebase-admin";
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "hich-1c131",
    private_key_id: "f8614cb8e0771d157998a45f7c6e527fadd694da",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDK+t6U6eQ/mt5v\nbGBub+y6A3cF2yPuzjdkQrZCA7T2PZaQSj250HJyvwu8/7YkPCLAhp1dizjiJGDk\nknYwRBC6tm7yGTpG+7LxcbwExVa2vR5IZfkBaIXzG5tDu07K7f0mKYHML4OX/+Jl\nSAdpnOPUWmvCwCa8ueqIYg9ItNpJKTH37g7TnRhqRWPaO+8rFJEOPEQcgv/9nHsA\nLOEWQ1PusXNSoULT4y8eF8TOeOcm8tKSFfoAq+Fa5I6FetpclGNKsjDJn+4qg6Qg\nt3+zDoTSKnhde4uCRVtlVDXAT9Zo9r9GUG9TEubIPD96cmXr+5+q909OuWLrjnH9\nAyD4siBrAgMBAAECggEAXDGcPZkKshUeqQ9ZsW+m30pJmmBRrtr9b82ZSNy0KhAJ\nPhpqdOaHxTSfGUYwLb8ercG24lElEhoh5E/d3MhdrODF/bKVtL4IJgBZvPUBENlP\nUuT2N7yI8sX8PMRr4mI8VEQQD3UZWUXBR+1yaHb5SG+VeIycS6ZKL44SkRyL9SQw\now6ESugSyOGkD0qjVQsLYGk+PINnsqqKb1REQ+md113GPodLtQV4wz8FWwHlMLd9\nDrBFgjWaBW4sI2Pc2pw9xrlvHV7H2SkfqYBYgQWIQc5JhXo1OQfh+wn678WD4SH0\neH/6o54gxocRaHfPJ/6dMwenYDqn6zsPwqxiIuh8iQKBgQDugPMDCx0hgrjw8jSZ\nyQ/LqC6zn9fLyiTaBC2DMFoM5uyY1w4BixG6ANvUaMY4EmJp1eyumh2EPlqXkbGM\neuIaZ15/5CCH481WiCKyTZS9TBZZXOcLqTrVu/343zpC5uAzAnr/b3IbAmeWuvuP\nPOO+AnfRwBQOUQR+G51wxs/GRQKBgQDZ3sqdntracD52oXwBj2govk+OZAG19YtZ\nGwm3WuZY0Mh10v/dL1E5C3NwaPAltr1NwT/v3YVOSNqNM0XBK74h4v+Q4UAF9sHJ\nKncUisYuNwe3hw3S8LDHmW1NtjnYj8W1yoQ3XS8vVuPxMNZ73ki+6Hv1/pFO4IBH\nECwNRYNO7wKBgGDdfFUbGWy3w9cP968RytmC59zKKYG6CreFBNsIMzqUOzlj9mtI\nCR4LJT0ihIbXaKLlYGgVbbF9BZwTbxHIAraIjwfQJioqqgXf6n+SJLuxAE6w/aFt\nzNhrrp16RBZR4HK3Ki8+GxC/LEU6kdq99xz/sZw9r6eU3gc9vfbEuDQlAoGBAK8n\nvh0aKTiUJKObD+bxM/wNhEglfnqa/XyVkCoomietMnwHNkzMTbBe1F/6/ZZUY7yv\nMIfWv+VADPSX0+yJDkKQDIadkKs6xnDEAxgwuUNOWpXhret4NadCYe2oIrlIXNra\nBZG9CMI2SOsPKGBNRI62uXH7Rzbypi57ge7pg7dhAoGBAJp3RqsYwzHg4Vis6qMT\ncflhiVCt4c6n38qDO72hHwCzbuwcXlQCdAgzT57jzjZIEc4X4tdlDVAFyMkzRjiS\nPOCdO19jFFRvnrA5RMh8USLSfetlOFCek4JflGk0Lbf3p7UgwbHj9mr1299VMvFa\nrzz2/NwavBTX0LhKFsb4Z2i1\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-m40ov@hich-1c131.iam.gserviceaccount.com",
  client_id: "103932004258394581353",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-m40ov%40hich-1c131.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
  }
  ),
  databaseURL: process.env.DATABASEURL,
});

export const adminAuth = admin.auth();
