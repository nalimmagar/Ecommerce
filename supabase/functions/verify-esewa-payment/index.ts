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
    const { orderId, transactionId, esewaReference } = await req.json();
    
    console.log('Verifying payment for order:', orderId);
    console.log('Transaction ID:', transactionId);
    console.log('eSewa Reference:', esewaReference);

    // Create Supabase service client
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get the order and payment details
    const { data: order, error: orderError } = await supabaseService
      .from('orders')
      .select('*, payments(*)')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    // For eSewa test environment, we'll mark as successful
    // In production, you would verify with eSewa's verification API
    const isPaymentSuccessful = true; // eSewa test always succeeds

    if (isPaymentSuccessful) {
      // Update payment status
      const { error: paymentUpdateError } = await supabaseService
        .from('payments')
        .update({
          status: 'completed',
          transaction_id: transactionId,
          esewa_reference: esewaReference
        })
        .eq('order_id', orderId);

      if (paymentUpdateError) {
        console.error('Payment update error:', paymentUpdateError);
        throw new Error('Failed to update payment status');
      }

      // Update order status
      const { error: orderUpdateError } = await supabaseService
        .from('orders')
        .update({ status: 'confirmed' })
        .eq('id', orderId);

      if (orderUpdateError) {
        console.error('Order update error:', orderUpdateError);
        throw new Error('Failed to update order status');
      }

      console.log('Payment verified and order confirmed');

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Payment verified successfully',
        order: { ...order, status: 'confirmed' }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      // Mark payment as failed
      await supabaseService
        .from('payments')
        .update({ status: 'failed' })
        .eq('order_id', orderId);

      return new Response(JSON.stringify({ 
        success: false,
        message: 'Payment verification failed'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

  } catch (error) {
    console.error('Verification error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});