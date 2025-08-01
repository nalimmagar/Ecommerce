import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { orderData } = await req.json();
    
    console.log('Creating order for user:', user.id);
    console.log('Order data:', orderData);

    // Create Supabase service client for inserting data
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Create order in database
    const { data: order, error: orderError } = await supabaseService
      .from('orders')
      .insert({
        user_id: user.id,
        email: orderData.email,
        phone: orderData.phone,
        delivery_address: orderData.address,
        items: orderData.items,
        total_price: orderData.totalPrice,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw new Error('Failed to create order');
    }

    console.log('Order created:', order);

    // Create payment record
    const { data: payment, error: paymentError } = await supabaseService
      .from('payments')
      .insert({
        order_id: order.id,
        amount: orderData.totalPrice,
        method: 'esewa',
        status: 'pending'
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment creation error:', paymentError);
      throw new Error('Failed to create payment record');
    }

    console.log('Payment record created:', payment);

    // eSewa test credentials
    const esewaConfig = {
      merchant_code: "EPAYTEST",
      success_url: `${req.headers.get("origin")}/payment-success?order_id=${order.id}`,
      failure_url: `${req.headers.get("origin")}/payment-failure?order_id=${order.id}`,
    };

    // Generate eSewa form data
    const esewaData = {
      amt: orderData.totalPrice,
      pcd: "EPAYTEST",
      psc: "0",
      txAmt: "0", 
      tAmt: orderData.totalPrice,
      pid: order.id,
      scd: esewaConfig.merchant_code,
      su: esewaConfig.success_url,
      fu: esewaConfig.failure_url
    };

    return new Response(JSON.stringify({ 
      success: true,
      orderId: order.id,
      paymentId: payment.id,
      esewaData,
      esewaUrl: "https://uat.esewa.com.np/epay/main"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});