import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AboutUs from './components/AboutUs'
import Services from './components/Services'
import ContactUs from './components/ContactUs'
import Footer from './components/Footer'
import Team from './components/team/team'
import ProductCard from './components/ProductCard'

import SearchModal from './components/SearchModal'
import CartModal from './components/CartModal'

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.name === product.name);
      if (existing) {
        return prev.map(item => 
          item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
   
    setIsCartOpen(true);
  };

  const productList = [
    {
      name: "Anatom Automatic Skeleton",
      price: "559.99",
      image: "https://www.rado.com/media/catalog/product/a/n/anatom_r10206109_sld_web_1.png?im=Resize=(0,0),aspect=fit;Crop=(0,0,0,0),gravity=Center,allowExpansion",
      description: "Comfortable watch for fashion wear."
    },
    {
      name: "Ceramic Watch",
      price: "8889.99",
      image: "https://www.rado.com/media/catalog/product/i/n/integral_r20256162_sld_web.png?im=Resize=(0,0),aspect=fit;Crop=(0,0,0,0),gravity=Center,allowExpansion",
      description: "Perfect for office and formal occasions."
    },
    {
      name: "Integeral",
      price: "3933.99",
      image: "https://www.rado.com/media/catalog/product/i/n/integral_r20255162_sld_web.png?im=Resize=(0,0),aspect=fit;Crop=(0,0,0,0),gravity=Center,allowExpansion",
      description: "Lightweight for casual outings"
    },
    {
      name: "Anatom Watch",
      price: "59.99",
      image: "https://www.rado.com/media/catalog/product/a/n/anatom_r10203102_sld_web_1.png?im=AspectCrop=(0,0),allowExpansion,location=(0.5,0.5);Resize=(0,0),aspect=fill;Crop=(0,0,0,0),gravity=Center",
      description: "Comfortable for daily wear."
    },
    {
      name: "The Square",
      price: "933.99",
      image: "https://www.rado.com/media/catalog/product/t/r/truesquare_r27174712_sld_web.png?im=AspectCrop=(0,0),allowExpansion,location=(0.5,0.5);Resize=(0,0),aspect=fill;Crop=(0,0,0,0),gravity=Center",
      description: "Lightweight for casual outings"
    },
    {
      name: "Blal's",
      price: "5900000.99",
      image: "https://www.rado.com/media/catalog/product/a/n/anatom_r10204712_sld_web_1.png?im=AspectCrop=(0,0),allowExpansion,location=(0.5,0.5);Resize=(0,0),aspect=fill;Crop=(0,0,0,0),gravity=Center",
      description: "Comfortable for daily wear."
    }
  ];

  return (
    <div className="app">
      <Navbar 
        onSearchClick={() => setIsSearchOpen(true)} 
        onCartClick={() => setIsCartOpen(true)}
        cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
      />
      
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
      />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/team" element={<Team />} />

      </Routes>
      <h1 style={{ marginTop: "50px", textAlign: "center" }} >Products</h1>
       <div style={{ marginTop: "50px" }} className="product-grid">
          {productList.map((product, idx) => (
            <ProductCard
              key={idx}
              {...product}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
        <AboutUs/>
      <Services/>
      <Team/>
      <ContactUs/>
      <Footer />
    </div>
  )
}

