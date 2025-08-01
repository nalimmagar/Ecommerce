import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  isNew?: boolean;
  rating?: number;
  stock: number;
}

const ProductCard = ({ 
  name, 
  price, 
  images, 
  category, 
  isNew, 
  rating = 5,
  stock 
}: ProductCardProps) => {
  return (
    <Card className="group cursor-pointer overflow-hidden border-border hover:shadow-medium transition-smooth">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={images[0] || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <Badge className="bg-accent text-accent-foreground">New</Badge>
          )}
          {stock < 5 && stock > 0 && (
            <Badge variant="destructive">Low Stock</Badge>
          )}
          {stock === 0 && (
            <Badge variant="outline" className="bg-background">Out of Stock</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-smooth"
        >
          <Heart className="h-4 w-4" />
        </Button>

        {/* Quick Add to Cart */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-smooth">
          <Button variant="gemstone" className="w-full" disabled={stock === 0}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs capitalize">
            {category}
          </Badge>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < rating ? 'text-gemstone-amber fill-current' : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
        </div>
        
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
          {name}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            ${price.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">
            {stock} in stock
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;