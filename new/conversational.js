// ConversationalInterface.js
import React, { useState } from 'react';
import './styles.css';

const products = [
  { productId: '1', productName: 'Blue Denim Shirt', category: 'shirt', price: 25.99, discount: '10%' },
  { productId: '2', productName: 'Black Cotton T-Shirt', category: 'shirt', price: 15.99, discount: '5%' },
  { productId: '3', productName: 'Formal White Shirt', category: 'shirt', price: 35.49, discount: '15%' },
  { productId: '4', productName: 'Slim Fit Jeans', category: 'jeans', price: 45.00, discount: '20%' }
];

function ConversationalInterface() {
  const [userInput, setUserInput] = useState('');
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  const handleUserInput = async () => {
    if (!userInput.trim()) return;

    const response = await fetch('/api/process-user-input', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userInput })
    });

    const data = await response.json();
    setChatHistory([...chatHistory, { from: 'user', text: userInput }]);
    setProductSuggestions(data.productSuggestions);
    setUserInput('');
    openResultsInNewTab(data.productSuggestions);
  };

  const openResultsInNewTab = (suggestions) => {
    const newTab = window.open('', '_blank');
    const style = `
      <style>
        body { font-family: 'Poppins', sans-serif; padding: 20px; background: #f9f9f9; color: #333; }
        h2 { color: #007bff; }
        .product { padding: 10px; border-bottom: 1px solid #ccc; }
        .product span { display: block; margin: 5px 0; }
      </style>
    `;
    const content = suggestions.map(p => `
      <div class="product">
        <strong>${p.productName}</strong>
        <span>Price: $${p.price.toFixed(2)}</span>
        <span>Discount: ${p.discount}</span>
      </div>
    `).join('');

    newTab.document.write(`<html><head><title>Suggestions</title>${style}</head><body><h2>Product Suggestions</h2>${content}</body></html>`);
    newTab.document.close();
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Shopping Assistant</h1>
        <button className="logout-btn" onClick={() => alert('Logging out...')}>Logout</button>
      </header>

      <main className="container">
        <div className="card">
          <h2>Welcome!</h2>
          <p>Ask your assistant for product suggestions.</p>
          <div className="chat-box">
            {chatHistory.map((msg, index) => (
              <p key={index}><strong>{msg.from === 'user' ? 'You' : 'AI'}:</strong> {msg.text}</p>
            ))}
          </div>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask me something..."
          />
          <div>
            <button className="btn" onClick={handleUserInput}>Ask</button>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Connect with us:</p>
        <a href="https://wa.me" target="_blank">WhatsApp</a>
        <a href="https://instagram.com" target="_blank">Instagram</a>
        <a href="https://facebook.com" target="_blank">Facebook</a>
      </footer>
    </div>
  );
}

export default ConversationalInterface;
