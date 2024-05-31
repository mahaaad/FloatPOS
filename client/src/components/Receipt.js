import React, { useState, useEffect } from 'react';
import '../style/receipt.scss';
import Draggable from 'react-draggable';

const Receipt = ({ receiptItems, onAddMenuItem, onClose, title, onDeleteItem, onUpdateQuantity }) => {
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    calculateTotal();
  }, [receiptItems]);

  const calculateTotal = () => {
    const newSubtotal = receiptItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const newTax = newSubtotal * 0.13;
    const newTotal = newSubtotal + newTax;
    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newTotal);
  };

  return (
    <Draggable>
      <div className="receipt-container">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="receipt-header">
          <h2>{title}</h2>
          <div className="receipt-meta">
            <p>served by</p>
            <input type="text" placeholder="Server Name" />
            <p>{new Date().toLocaleString()}</p>
          </div>
        </div>
        <table className="receipt-table">
          <thead>
            <tr>
              <th>QTY</th>
              <th>ITEM</th>
              <th>PRICE</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {receiptItems.map((item, index) => (
              <tr key={index}>
                <td style={{position: 'relative'}}>
                    <div className="qty-container">
                  <div className="qty-button-container">
                    <button onClick={() => onUpdateQuantity(index, item.quantity + 1)}>
                        <img src="/assets/icons/up-icon.svg" />
                    </button>
                    <button onClick={() => onUpdateQuantity(index, item.quantity - 1)}>
                        <img src="/assets/icons/down-icon.svg" />
                    </button>
                  </div>
                  <span className="qty">
                    {item.quantity}
                  </span>
                  </div>
                </td>
                <td>
                  {item.name}
                  <ul className="receipt-item-options" style={{display: `${item.options.length > 0 ? 'block' : 'none'}`}}>
                    {item.options.map((option, i) => (
                      <li key={i}>{option.name} +${option.price}</li>
                    ))}
                  </ul>
                </td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button className="receipt-delete-button" onClick={() => onDeleteItem(index)}>
                      <img src="/assets/icons/delete-icon.svg"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="receipt-summary">
          <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
          <p><strong>Tax:</strong> ${tax.toFixed(2)}</p>
          <p><strong>Total:</strong> ${total.toFixed(2)}</p>
        </div>
        <div className="receipt-actions">
          <button className="receipt-button">discount</button>
          <button className="receipt-button">split</button>
          <button className="receipt-button">Pay ($)</button>
        </div>
      </div>
    </Draggable>
  );
};

export default Receipt;
