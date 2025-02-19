import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../css/Main.css';

const Main = () => {
  const navigate = useNavigate();

  const handleRedirectHome = () => {
    navigate('/');
  };

  const handleRedirectAbout = () => {
    navigate('/login');
  };

  const handleRedirectContact = () => {
    navigate('/login');
  };
  
  const handleRedirectLogin = () => {
    navigate('/login');
  };

  const handleRedirectRegister = () => {
    navigate('/register');
  };

  return (
    <div className='blackmain'>
      <nav class="navbar">
        <div class="navbar-container">
          <ul class="nav-links">
            <li><button class="active" onClick={handleRedirectHome}>Home</button></li>
            <li><button onClick={handleRedirectAbout}>About</button></li>
            <li><button onClick={handleRedirectContact}>Contact</button></li>
            <li><button onClick={handleRedirectLogin}>Login</button></li>
            <li><button onClick={handleRedirectRegister}>Register</button></li>
          </ul>
        </div>
      </nav>
      <div className="block">
        <div className="left-content">
            <h1>Redefining Convenience One Store at a Time</h1>
        </div>
        <div className="right-content">
            <p>Integrate curbside pickup and a delivery system with your store using our convenient system.</p>
        </div>
      </div>
      <div className="info">
        <h1>Convenience for You and Your Customers</h1>
        <p>Integrating curbside pickup and delivery services with your small business offers unparalleled convenience for both you and your customers. By streamlining the order and delivery process, customers can enjoy the ease of shopping from the comfort of their homes while still supporting local businesses. This seamless integration ensures that your business remains competitive and adaptable in a rapidly changing marketplace. With efficient pickup and delivery options, you'll be able to reach a wider audience, enhance customer satisfaction, and ultimately drive growth. Embrace this innovative approach to stay connected with your customers and meet their evolving needs.</p>
        <div className="inside1">
          <p>Enhanced Customer Experience: Offer your customers a modern shopping experience with easy access to curbside pickup and delivery options. This convenience boosts customer satisfaction and encourages repeat business.</p>

          <p>Streamlined Operations: Simplify the order management process for your business. Our software integrates seamlessly with your existing systems, making it easy to manage orders, track deliveries, and update inventory in real time.</p>

          <p>Increased Reach: Expand your customer base by offering flexible delivery and pickup options. Attract new customers who prefer online shopping and maintain loyalty by providing multiple ways to receive their purchases.</p>

          <p>Data-Driven Insights: Gain valuable insights into customer behavior and sales trends with built-in analytics. Use this data to make informed business decisions, optimize inventory, and tailor your marketing strategies.</p>

          <p>Cost-Effective Solution: Reduce overhead costs by minimizing the need for in-store staffing and maximizing the efficiency of delivery routes. Our software helps you save time and money while enhancing your service offerings.</p>

          <p>Scalable Platform: Whether you're a small boutique or a growing chain, our software is designed to scale with your business. Easily add new features, locations, or services as your needs evolve.</p>

          <p>Contactless Options: Prioritize health and safety by offering contactless pickup and delivery options. This feature meets current consumer preferences and ensures your business is aligned with public health guidelines.</p>

          <p>Easy Integration: Our software integrates effortlessly with popular e-commerce platforms and payment gateways, allowing you to maintain a seamless online presence and provide a smooth checkout process for your customers.</p>

          <p>Customer Support: Benefit from dedicated customer support and training resources to ensure you and your team can make the most of the software’s features and capabilities.</p>

          <p>Customization: Tailor the software to meet your specific business needs with customizable settings and features. Create a unique experience that reflects your brand and enhances customer loyalty.</p>
        </div>
      </div>
    </div>
  );
};

export default Main;