import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  created_at: string;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isNew = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffInDays = (now.getTime() - created.getTime()) / (1000 * 3600 * 24);
    return diffInDays <= 7; // Consider products new if less than 7 days old
  };

  if (loading) {
    return (
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Collection
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most beloved pieces, each carefully crafted with premium materials and attention to detail.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg aspect-square mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Collection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most beloved pieces, each carefully crafted with premium materials and attention to detail.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Coming Soon
            </h3>
            <p className="text-muted-foreground mb-6">
              Our beautiful collection is being prepared. Check back soon for amazing handcrafted jewelry!
            </p>
            <Button variant="outline">
              Notify Me When Available
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  images={product.images}
                  category={product.category}
                  stock={product.stock}
                  isNew={isNew(product.created_at)}
                />
              ))}
            </div>

            <div className="text-center">
              <Button variant="golden" size="lg">
                View All Products
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;