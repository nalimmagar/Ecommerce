import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/hooks/useCart';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const orderId = searchParams.get('order_id') || localStorage.getItem('pending_order_id');
        const transactionId = searchParams.get('oid');
        const esewaReference = searchParams.get('refId');

        if (!orderId) {
          throw new Error('Order ID not found');
        }

        const { data, error } = await supabase.functions.invoke('verify-esewa-payment', {
          body: {
            orderId,
            transactionId,
            esewaReference
          }
        });

        if (error) {
          console.error('Verification error:', error);
          throw new Error('Payment verification failed');
        }

        if (data.success) {
          setVerificationSuccess(true);
          clearCart();
          localStorage.removeItem('pending_order_id');
          
          toast({
            title: "Payment successful!",
            description: "Your order has been confirmed and will be processed soon."
          });
        } else {
          throw new Error(data.message || 'Payment verification failed');
        }

      } catch (error) {
        console.error('Payment verification error:', error);
        toast({
          title: "Payment verification failed",
          description: "There was an issue verifying your payment. Please contact support.",
          variant: "destructive"
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, clearCart, toast]);

  return (
    <div className="min-h-screen bg-gradient-radial">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                {isVerifying ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Verifying Payment...
                  </>
                ) : verificationSuccess ? (
                  <>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    Payment Successful!
                  </>
                ) : (
                  <>
                    Payment Verification Failed
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {isVerifying ? (
                <p className="text-muted-foreground">
                  Please wait while we verify your payment with eSewa...
                </p>
              ) : verificationSuccess ? (
                <>
                  <p className="text-muted-foreground">
                    Thank you for your purchase! Your order has been confirmed and will be processed soon.
                    You will receive updates via email and SMS.
                  </p>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => navigate('/profile')}
                      className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
                    >
                      View My Orders
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/')}
                      className="w-full"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground">
                    We couldn't verify your payment. If money was deducted from your account, 
                    please contact our support team with your transaction details.
                  </p>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => navigate('/checkout')}
                      className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
                    >
                      Try Again
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/')}
                      className="w-full"
                    >
                      Return Home
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;