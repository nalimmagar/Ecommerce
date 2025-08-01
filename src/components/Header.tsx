import { useState } from "react";
import { ShoppingCart, User, Menu, X, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-mystic rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">JC</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Jewel Crafted</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-smooth">Home</a>
            <a href="#" className="text-foreground hover:text-primary transition-smooth">Bracelets</a>
            <a href="#" className="text-foreground hover:text-primary transition-smooth">Earrings</a>
            <a href="#" className="text-foreground hover:text-primary transition-smooth">About</a>
            <a href="#" className="text-foreground hover:text-primary transition-smooth">Contact</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-accent text-accent-foreground text-xs">
                3
              </Badge>
            </Button>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-foreground hover:text-primary transition-smooth">Home</a>
              <a href="#" className="text-foreground hover:text-primary transition-smooth">Bracelets</a>
              <a href="#" className="text-foreground hover:text-primary transition-smooth">Earrings</a>
              <a href="#" className="text-foreground hover:text-primary transition-smooth">About</a>
              <a href="#" className="text-foreground hover:text-primary transition-smooth">Contact</a>
              <div className="flex items-center space-x-2 pt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-accent text-accent-foreground text-xs">
                    3
                  </Badge>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;