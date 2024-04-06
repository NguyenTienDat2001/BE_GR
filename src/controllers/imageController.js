import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import path from "path";

const getImageAsBase64 = (req, res) => {
  // Tạo đường dẫn tuyệt đối đến thư mục 'uploads' từ thư mục hiện tại của file 'imageController.js'
  const uploadsDirectory = path.join(__dirname, "../uploads");

  // Tạo đường dẫn tuyệt đối tới file ảnh
  const imagePath = path.join(uploadsDirectory, "pic1.jpg");

  fs.readFile(imagePath, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to read the image" });
    }

    const base64data = data.toString("base64");
    return res.status(200).json({ base64data });
  });
};
const downloadImage = (req, res) => {
  const { base64Data, id } = req.body;

  const imagePath = path.join(
    __dirname,
    "..    ",
    "uploads",
    `picture_${id}.jpg`
  );
  const dataBuffer = Buffer.from(base64Data, "base64");

  fs.writeFile(imagePath, dataBuffer, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to save the image" });
    }
    return res
      .status(200)
      .json({ message: "Image downloaded and saved successfully" });
  });
};

export default { getImageAsBase64, downloadImage };
