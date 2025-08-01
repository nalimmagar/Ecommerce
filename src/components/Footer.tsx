import { Heart, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-gemstone-onyx text-gemstone-pearl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-mystic rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">JC</span>
              </div>
              <h3 className="text-xl font-bold">Jewel Crafted</h3>
            </div>
            <p className="text-gemstone-pearl/80 leading-relaxed">
              Handcrafted jewelry inspired by nature's beauty. Each piece tells a story of artisanal excellence and spiritual connection.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gemstone-pearl hover:text-gemstone-turquoise hover:bg-gemstone-turquoise/10">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gemstone-pearl hover:text-gemstone-turquoise hover:bg-gemstone-turquoise/10">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gemstone-pearl hover:text-gemstone-turquoise hover:bg-gemstone-turquoise/10">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gemstone-pearl/80 hover:text-gemstone-turquoise transition-smooth">About Us</a></li>
              <li><a href="#" className="text-gemstone-pearl/80 hover:text-gemstone-turquoise transition-smooth">Bracelets</a></li>
              <li><a href="#" className="text-gemstone-pearl/80 hover:text-gemstone-turquoise transition-smooth">Earrings</a></li>
              <li><a href="#" className="text-gemstone-pearl/80 hover:text-gemstone-turquoise transition-smooth">Custom Orders</a></li>
              <li><a href="#" className="text-gemstone-pearl/80 hover:text-gemstone-turquoise transition-smooth">Care Guide</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gemstone-pearl/80 hover:text-gemstone-turquoise transition-smooth">Contact Us</a></li>
              <li><a href="#" className="text-gemstone-pearl/80 hover:text-gemstone-turquoise transition-smooth">Shipping Info</a></li>
              <li><a href="#" className="text-gemstone-pearl/80 hover:text-gemstone-turquoise transition-smooth">Returns</a></li>
              <li><a href="#" className="text-gemstone-pearl/80 hover:text-gemstone-turquoise transition-smooth">Size Guide</a></li>
              <li><a href="#" className="text-gemstone-pearl/80 hover:text-gemstone-turquoise transition-smooth">FAQ</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Connected</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gemstone-turquoise" />
                <span className="text-sm text-gemstone-pearl/80">hello@jewelcrafted.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gemstone-turquoise" />
                <span className="text-sm text-gemstone-pearl/80">+977 9800000000</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gemstone-turquoise" />
                <span className="text-sm text-gemstone-pearl/80">Kathmandu, Nepal</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gemstone-pearl/80">Subscribe for updates</p>
              <div className="flex space-x-2">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gemstone-pearl/10 border-gemstone-pearl/20 text-gemstone-pearl placeholder:text-gemstone-pearl/60"
                />
                <Button variant="gemstone" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gemstone-pearl/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gemstone-pearl/60">
            © 2024 Jewel Crafted. Made with ❤️ in Nepal.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gemstone-pearl/60 hover:text-gemstone-turquoise transition-smooth">Privacy Policy</a>
            <a href="#" className="text-sm text-gemstone-pearl/60 hover:text-gemstone-turquoise transition-smooth">Terms of Service</a>
            <a href="#" className="text-sm text-gemstone-pearl/60 hover:text-gemstone-turquoise transition-smooth">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;