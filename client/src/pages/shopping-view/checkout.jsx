import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { generateTransactionUUID } from "@/pages/shopping-view/utilis/uuid"; 



function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(currentSelectedAddress, "cartItems");

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

//       const handleEsewaPayment = async () => {
//   if (!currentSelectedAddress) {
//     toast({ title: "Please select a delivery address." });
//     return;
//   }

//   try {
//   // 1. Define signed field order
//   const signedFieldOrder = ["total_amount", "transaction_uuid", "product_code"];
//   const signed_field_names = signedFieldOrder.join(",");
//   const stringToSign = signedFieldOrder.map(key => allFields[key].toString().trim()).join(",");

//   // 👇 Debug logs
//   console.log("[Frontend] Fields:", allFields);
//   console.log("[Frontend] Signed Field Names:", signed_field_names);
//   console.log("[Frontend] String to Sign:", stringToSign);

//   // 2. Get signature from backend
//   const signatureRes = await fetch("http://localhost:5000/api/esewa/signature", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ 
//       total_amount: allFields.total_amount,
//       transaction_uuid: allFields.transaction_uuid,
//       product_code: allFields.product_code,
//       signed_field_names
//     })
//   });
//   const { signature } = await signatureRes.json();

//   console.log("[Frontend] Signature Received:", signature);

//   const transaction_uuid = generateTransactionUUID();


//   // 3. Prepare final form fields (including required but unsigned fields)
//   const formFields = {
//     amount: allFields.amount,                                   // e.g., 100
//     tax_amount: allFields.tax_amount || "0",                    // e.g., 0
//     total_amount: allFields.total_amount,                       // e.g., 100
//     transaction_uuid,               // e.g., "order-123"
//     product_code: allFields.product_code,                       // e.g., "EPAYTEST"
//     product_service_charge: "0",
//     product_delivery_charge: "0",
//     success_url: "https://yourdomain.com/success",              // ✅ Replace with real URLs
//     failure_url: "https://yourdomain.com/failure",              // ✅ Replace with real URLs
//     signed_field_names,
//     signature
//   };

//   // 4. Create and submit the form
//   const form = document.createElement("form");
//   form.method = "POST";
//   form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

//   Object.entries(formFields).forEach(([name, value]) => {
//     const input = document.createElement("input");
//     input.type = "hidden";
//     input.name = name;
//     input.value = value;
//     form.appendChild(input);
//   });

//   document.body.appendChild(form);

//   // ⏳ Optional delay to inspect logs
//   setTimeout(() => {
//     console.log("🚀 Submitting Form to eSewa with:");
//     Object.entries(formFields).forEach(([k, v]) => console.log(`${k}:`, v));
//     form.submit();
//   }, 3000); // Adjust delay as needed

// } catch (error) {
//   console.error("[eSewa Payment Error]", error);
//   toast({ title: "Payment error. Please try again." });
// }
//       }


const handleEsewaPayment = async () => {
  if (!currentSelectedAddress) {
    toast({ title: "Please select a delivery address." });
    return;
  }

  try {
    // ✅ Step 1: Generate UUID FIRST
    const transaction_uuid = generateTransactionUUID();

    // ✅ Step 2: Define all fields consistently
    const allFields = {
      amount: totalCartAmount.toFixed(2),            // Amount before tax/delivery
      tax_amount: "0",
      total_amount: totalCartAmount.toFixed(2),      // Total final amount
      transaction_uuid,
      product_code: "EPAYTEST",                      // Your test product code
    };

    const signedFieldOrder = ["total_amount", "transaction_uuid", "product_code"];
    const signed_field_names = signedFieldOrder.join(",");
    const stringToSign = signedFieldOrder.map(key => allFields[key].toString().trim()).join(",");

    console.log("[Frontend] Fields:", allFields);
    console.log("[Frontend] Signed Field Names:", signed_field_names);
    console.log("[Frontend] String to Sign:", stringToSign);

    // ✅ Step 3: Ask backend for signature
    const signatureRes = await fetch("http://localhost:5000/api/esewa/signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...allFields,
        signed_field_names
      })
    });

    const { signature } = await signatureRes.json();
    console.log("[Frontend] Signature Received:", signature);

    // ✅ Step 4: Prepare final form fields
    const formFields = {
      amount: allFields.amount,
      tax_amount: allFields.tax_amount,
      total_amount: allFields.total_amount,
      transaction_uuid,
      product_code: allFields.product_code,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: "http://localhost:3000/payment-success", // Change as needed
      failure_url: "http://localhost:3000/payment-failure", // Change as needed
      signed_field_names,
      signature
    };

    // ✅ Step 5: Create form and auto-submit
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    Object.entries(formFields).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    setTimeout(() => {
      console.log("🚀 Submitting eSewa form with values:", formFields);
      form.submit();
    }, 2000);

  } catch (error) {
    console.error("[eSewa Payment Error]", error);
    toast({ title: "Payment error. Please try again." });
  }
};



  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          {/* PayPal button removed. Only eSewa payment is available. */}
          <div className="mt-4 w-full">
            <Button onClick={handleEsewaPayment} className="w-full">
              Pay with eSewa
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
