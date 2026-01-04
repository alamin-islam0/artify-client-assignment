import axios from "axios";

// User provided API Key
const image_hosting_key = "ffdd337d520d996419c0b1f29873f965";
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

export const uploadImageCurrent = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await axios.post(image_hosting_api, formData, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });

  if (res.data.success) {
    return res.data.data.url;
  }
  return null;
};
