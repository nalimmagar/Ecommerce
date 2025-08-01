import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';

const CartPage = () => {
  return (
    <div className="min-h-screen bg-gradient-radial">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Cart />
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;