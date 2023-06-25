const nodemailer = require("nodemailer");
const async = require("../middleware/async");
const fs = require("fs");
const path = require("path");
const { decode } = require("base64-arraybuffer");

const sendEmailWithAttachment = async(async (req, res) => {
  // const pdfDataUrl = req.body.pdfDataUrl;
  const email = req.body.email;
  console.log(email);
  const pdfDataUrl = req.body.pdfDataUrl;

  const base64Data = pdfDataUrl.split(";base64,").pop();

  const arrayBuffer = decode(base64Data);

  const buffer = Buffer.from(arrayBuffer);

  // Define the file path and name
  const filePath = path.join(__dirname, "pdfs");
  console.log(__dirname);
  const fileName = "document.pdf";
  const fullPath = path.join(filePath, fileName);

  try {
    // Create the folder if it doesn't exist
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
    }

    // Save the PDF file to the specified path
    fs.writeFileSync(fullPath, buffer);

    console.log("PDF file saved successfully.");
  } catch (error) {
    console.log("Error occurred:", error);
    console.log("An error occurred while saving the PDF file.");
  }
  // Create a Nodemailer transporter
  let transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  // Define the email details
  let mailOptions = {
    from: "azazjamil99@gmail.com",
    to: email,
    subject: "AWS pricing",
    text: "Please find the attached PDF file.",
    attachments: [
      {
        filename: "document.pdf",
        path: `${filePath}/document.pdf`,
      },
    ],
  };

  // Send the email
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log(info);
    fs.unlinkSync(fullPath);
    res.send(info.response);
  } catch (error) {
    console.log("Error occurred:", error);
  }
});
// Call the function to send the email
module.exports = { sendEmailWithAttachment };
