// components/Footer.tsx
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: Brand */}
        <div>
          <h2 className="text-xl font-bold mb-2">Jewel Crafted</h2>
          <p className="text-sm mb-4">
            Handcrafted jewelry inspired by nature’s beauty. Each piece tells a story of artisanal excellence and spiritual connection.
          </p>
          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram className="w-5 h-5 hover:text-pink-500" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook className="w-5 h-5 hover:text-blue-500" />
            </a>
            <a href="#">
              <Twitter className="w-5 h-5 hover:text-cyan-400" />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Bracelets</a></li>
            <li><a href="#">Earrings</a></li>
            <li><a href="#">Custom Orders</a></li>
            <li><a href="#">Care Guide</a></li>
          </ul>
        </div>

        {/* Column 3: Customer Service */}
        <div>
          <h3 className="font-semibold mb-3">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">Size Guide</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div>
          <h3 className="font-semibold mb-3">Stay Connected</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@jewelcrafted.com</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +977 9800000000</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Kathmandu, Nepal</li>
          </ul>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-sm text-center text-gray-400">
        <p>© 2024 Jewel Crafted. Made with <span className="text-red-500">❤️</span> in Nepal.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Refund Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
