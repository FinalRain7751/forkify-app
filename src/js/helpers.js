import { TIMEOUT_SECONDS } from "./config";

export const timeout = (delayInSec) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(
          `Request took too long. Request timed out after ${delayInSec} seconds!`
        )
      );
    }, delayInSec * 1000);
  });
};

export const getJSON = async (url) => {
  try {
    const response = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(`${resData?.message ?? "Error"} (${response.status})`);
    }

    return resData;
  } catch (err) {
    throw err;
  }
};
