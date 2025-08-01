import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground text-center mb-6">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Button 
          onClick={() => navigate('/')}
          className="bg-gradient-primary text-primary-foreground hover:opacity-90"
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif">Shopping Cart</h2>
        <Badge variant="secondary" className="px-3 py-1">
          {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
        </Badge>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                  <p className="text-lg font-bold text-primary">NPR {item.price.toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <span className="w-12 text-center font-semibold">
                    {item.quantity}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg">
                    NPR {(item.price * item.quantity).toLocaleString()}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-lg">
            <span>Subtotal ({getTotalItems()} items)</span>
            <span className="font-semibold">NPR {getTotalPrice().toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span className="text-primary">NPR {getTotalPrice().toLocaleString()}</span>
          </div>

          <Button 
            onClick={handleCheckout}
            className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant"
            size="lg"
          >
            Proceed to Checkout
          </Button>
          
          {!user && (
            <p className="text-sm text-muted-foreground text-center">
              Please sign in to continue with checkout
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Cart;