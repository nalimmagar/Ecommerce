import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle } from 'lucide-react';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-gradient-radial">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-destructive">
                <XCircle className="h-6 w-6" />
                Payment Failed
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Your payment was not processed successfully. No money has been deducted from your account.
              </p>
              
              {orderId && (
                <p className="text-sm text-muted-foreground">
                  Order ID: {orderId}
                </p>
              )}

              <div className="space-y-2">
                <Button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
                >
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/cart')}
                  className="w-full"
                >
                  Return to Cart
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentFailure;