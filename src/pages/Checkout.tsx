import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Truck, MapPin, Phone, Mail, User } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Checkout = () => {
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    paymentMethod: 'esewa'
  });

  // Redirect if not authenticated or cart is empty
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (items.length === 0) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create order in database
      const orderData = {
        user_id: user.id,
        items: items as any, // Cast to Json type
        total_price: getTotalPrice(),
        email: formData.email,
        phone: formData.phone,
        delivery_address: formData.address,
        status: 'pending' as const
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

        if (formData.paymentMethod === 'esewa') {
          // Use edge function for eSewa payment
          const orderData = {
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            items: items,
            totalPrice: totalWithShipping
          };

          const { data, error } = await supabase.functions.invoke('create-esewa-payment', {
            body: { orderData }
          });

          if (error) {
            console.error('Payment creation error:', error);
            throw new Error('Failed to create payment');
          }

          if (data.success) {
            // Store order ID for payment verification
            localStorage.setItem('pending_order_id', data.orderId);
            
            // Create form and redirect to eSewa
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = data.esewaUrl;

            Object.entries(data.esewaData).forEach(([key, value]) => {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = value.toString();
              form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
          } else {
            throw new Error(data.error || 'Payment creation failed');
          }
        } else {
          // Handle COD (Cash on Delivery) - update the existing order
          const { error: updateError } = await supabase
            .from('orders')
            .update({ status: 'processing' })
            .eq('id', order.id);

          if (updateError) {
            throw updateError;
          }

          toast({
            title: "Order placed successfully!",
            description: "Your order has been placed. You can pay when the item is delivered.",
          });
          
          clearCart();
          navigate('/profile');
        }
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        variant: "destructive",
        title: "Order failed",
        description: error.message || "Failed to create order. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shippingCost = 100; // Fixed shipping cost
  const totalWithShipping = getTotalPrice() + shippingCost;

  return (
    <div className="min-h-screen bg-gradient-radial">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif text-primary mb-2">Checkout</h1>
            <p className="text-muted-foreground">Complete your order</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your complete delivery address"
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={formData.paymentMethod} 
                    onValueChange={handlePaymentMethodChange}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="esewa" id="esewa" />
                      <Label htmlFor="esewa" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">eSewa</p>
                            <p className="text-sm text-muted-foreground">Pay securely with eSewa</p>
                          </div>
                          <div className="text-green-600 font-semibold">Recommended</div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div>
                          <div className="flex items-center">
                            <Truck className="h-4 w-4 mr-2" />
                            <p className="font-semibold">Cash on Delivery</p>
                          </div>
                          <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>{items.length} {items.length === 1 ? 'item' : 'items'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-semibold">NPR {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>NPR {getTotalPrice().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>NPR {shippingCost.toLocaleString()}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">NPR {totalWithShipping.toLocaleString()}</span>
                  </div>

                  <Button 
                    onClick={handleSubmit}
                    disabled={isLoading || !formData.fullName || !formData.phone || !formData.address}
                    className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant"
                    size="lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Place Order - NPR ${totalWithShipping.toLocaleString()}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;