const crypto = require("crypto");

// eSewa signature generation: only sign the fields listed in signed_field_names, in order, separated by commas
// exports.getEsewaSignature = (req, res) => {
//   // Per eSewa documentation, only sign total_amount, transaction_uuid, product_code in that order
//   const secret = "8gBm/:&EnhH.1/q"; // eSewa test secret key
//   console.log(secret.length); // should be 14

//   const signFields = ["total_amount", "transaction_uuid", "product_code"];
// //   const values = signFields.map(name => {
// //     const value = req.body[name];
// //     if (value === undefined || value === null || value === "") {
// //       console.warn(`[eSewa Signature Warning] Field '${name}' is undefined, null, or empty! Value:`, value);
// //     }
// //     console.log(`[eSewa Signature Field] ${name}:`, value);
// //     return String(value).trim();
// //   });
//   const values = signFields.map(name => {
//   const value = req.body[name];
//   if (value === undefined || value === null || value === "") {
//     console.warn(`[eSewa Signature Warning] Field '${name}' is undefined, null, or empty! Value:`, value);
//   }
//   console.log(`[eSewa Signature Field] ${name}:`, value);
//   return String(value).trim();
// });

exports.getEsewaSignature = (req, res) => {
  const secret = "8gBm/:&EnhH.1/q"; // Note the trailing '('
  const signFields = ["total_amount", "transaction_uuid", "product_code"];

  const values = signFields.map(name => {
    const value = req.body[name];
    if (value === undefined || value === null || value === "") {
      console.warn(`[eSewa Signature Warning] Field '${name}' is undefined, null, or empty! Value:`, value);
    }
    console.log(`[eSewa Signature Field] ${name}:`, value);
    return String(value).trim(); 
  });



  const data = values.join(",");
// const data = "100,11-201-13,EPAYTEST";


  console.log("[eSewa Signature String]", data); // Log the string being signed
  console.log("[eSewa Signature String]", `"${data}"`); // Wrap in quotes to see whitespace

  const signature = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64");

  console.log("[eSewa Signature Result]", signature); // Log the generated signature

  res.json({ signature });
};
const axios = require("axios");

const Order = require("../../models/Order");

exports.verifyEsewaPayment = async (req, res) => {
  const { amt, pid, refId } = req.body;
  try {
    const response = await axios.post(
      "https://rc-epay.esewa.com.np/api/epay/verify/v2",
      {
        amt,
        refId,
        pid,
        scd: "EPAYTEST",
      }
    );
    if (response.data.status === "COMPLETE") {
      // Mark order as paid in your DB here
      const order = await Order.findById(pid);
      if (order) {
        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        await order.save();
      }
      return res.json({ success: true });
    }
    res.json({ success: false });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
