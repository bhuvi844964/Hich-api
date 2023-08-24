import admin from "firebase-admin";

import { readFileSync } from "fs";

import { fileURLToPath } from "url";

import { join, dirname } from "path";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, "../serviceAccountKey.json"))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const sendPushNotification = async (registrationTokens, title, body) => {
  const message = {
    notification: {
      title: title,

      body: body,
    },

    tokens: registrationTokens,
  };

  try {
    const response = await admin.messaging().sendMulticast(message);

    const failures = response.responses.filter((res) => !res.success);

    if (failures.length > 0) {
      console.log("Failed push notifications:", failures);
    }
  } catch (error) {
    console.log("Error sending message:", error);
  }
};
