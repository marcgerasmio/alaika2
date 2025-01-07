function Footer() {
  return (
    <footer className="bg-[#4B3D8F] text-white py-12">
      <div className="container mx-auto px-8">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Column 1 */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-[#FFE4E1]">About Us</h3>
            <p className="text-sm leading-relaxed text-gray-200">
              We provide curated gift boxes designed to make your loved ones
              happy. Thoughtful gifts, beautifully packaged with love and care.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-[#FFE4E1]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:underline hover:text-[#FFC0CB] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:underline hover:text-[#FFC0CB] transition-colors">
                  Shop
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:underline hover:text-[#FFC0CB] transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:underline hover:text-[#FFC0CB] transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-[#FFE4E1]">Contact</h3>
            <p className="text-sm text-gray-200 mb-2">Email: support@giftbox.com</p>
            <p className="text-sm text-gray-200 mb-2">Phone: +1 234 567 890</p>
            <p className="text-sm text-gray-200">Address: 123 Giftbox Lane, Happy Town</p>
          </div>
        </div>

        <hr className="my-8 border-[#FFC0CB]" />

        <div className="text-center text-sm text-gray-200">
          &copy; {new Date().getFullYear()} Giftbox. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
