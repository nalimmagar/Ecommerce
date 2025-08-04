import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

function EsewaReturnPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const amt = params.get("amt");
  const oid = params.get("oid");
  const refId = params.get("refId");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refId = params.get("refId");
    const pid = localStorage.getItem("epay_order_id");
    const amt = localStorage.getItem("epay_order_amt");
    console.log("[eSewa Return] refId:", refId, "pid:", pid, "amt:", amt);

    if (refId && pid && amt) {
      fetch("http://localhost:5000/api/esewa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refId, pid, amt }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("[VERIFY RESULT]", data);
          if (data.success) {
            navigate("/shop/payment-success");
          } else {
            navigate("/shop/esewa-fail");
          }
        });
    }
  }, [navigate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing eSewa Payment...Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default EsewaReturnPage;
