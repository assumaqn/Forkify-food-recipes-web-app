// import { TIME_OUTsec } from "./Helpers.js";
import { TIME_OUTsec } from "./config.js";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, upload = undefined) {
  try {
    const fetchPro = upload
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(upload),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIME_OUTsec)]); // Increase timeout
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message}(${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};
/*
export const getJson = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIME_OUTsec)]); // Increase timeout
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message}(${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJson = async function (url, upload) {
  try {
    const fetchPro = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(upload),
    });
    const res = await Promise.race([fetchPro, timeout(TIME_OUTsec)]); // Increase timeout
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message}(${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};
*/
