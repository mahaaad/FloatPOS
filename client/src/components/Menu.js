import React, { useState } from 'react';
import '../style/menu.scss';
import Receipt from './Receipt';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '', image: '', options: [] });
  const [optionName, setOptionName] = useState('');
  const [optionPrice, setOptionPrice] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [receiptItems, setReceiptItems] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptTitle, setReceiptTitle] = useState('Receipt for Table A20'); // Default title

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewItem({ ...newItem, image: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSaveItem = () => {
    setMenuItems([...menuItems, newItem]);
    setNewItem({ name: '', price: '', description: '', image: '', options: [] });
    setIsCreatingItem(false);
  };

  const handleAddOption = () => {
    const newOption = { name: optionName, price: optionPrice };
    setNewItem({ ...newItem, options: [...newItem.options, newOption] });
    setOptionName('');
    setOptionPrice('');
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = newItem.options.filter((_, i) => i !== index);
    setNewItem({ ...newItem, options: updatedOptions });
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setSelectedOptions([]);
  };

  const handleClosePanel = () => {
    setSelectedItem(null);
    setSelectedOptions([]);
  };

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(o => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const calculateTotal = (price, options) => {
    const subtotal = options.reduce((acc, option) => acc + parseFloat(option.price || 0), parseFloat(price));
    const tax = subtotal * 0.13;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleAddMenuItem = (title) => {
    if (selectedItem) {
      const newReceiptItem = {
        ...selectedItem,
        options: selectedOptions,
        price: calculateTotal(selectedItem.price, selectedOptions).total,
        quantity: 1
      };

      const existingItemIndex = receiptItems.findIndex(
        item => item.name === newReceiptItem.name && JSON.stringify(item.options) === JSON.stringify(newReceiptItem.options)
      );

      if (existingItemIndex !== -1) {
        const updatedReceiptItems = [...receiptItems];
        updatedReceiptItems[existingItemIndex].quantity += 1;
        setReceiptItems(updatedReceiptItems);
      } else {
        setReceiptItems([...receiptItems, newReceiptItem]);
      }

      setShowReceipt(true);
      setReceiptTitle(title);
      handleClosePanel();
    }
  };

  const handleDeleteItem = (index) => {
    const updatedReceiptItems = receiptItems.filter((_, i) => i !== index);
    setReceiptItems(updatedReceiptItems);
  };

  const handleUpdateQuantity = (index, quantity) => {
    if (quantity > 0) {
      const updatedReceiptItems = [...receiptItems];
      updatedReceiptItems[index].quantity = quantity;
      setReceiptItems(updatedReceiptItems);
    }
  };

  return (
    <div className="menu-container">
      {!isCreatingItem ? (
        <>
          <div className="menu-options">
            <input
              type="text"
              className="search-bar"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="menu-filter-button">
              <img src="/assets/icons/filter-icon.svg"/>
            </button>
            <div>
              <button className="menu-button" onClick={() => setIsCreatingItem(true)}>+ Create Menu Item</button>
            </div>
            <div>
              <button className="menu-button">+ Create Menu Page</button>
            </div>
          </div>
          <div className="menu-list">
            {filteredMenuItems.length > 0 ? (
              filteredMenuItems.map((item, index) => (
                <div key={index} className="menu-item" onClick={() => handleItemClick(item)}>
                  {item.image && <img src={item.image} alt={item.name} />}
                  <h4 className="menu-item-name">{item.name}</h4>
                  <p className="menu-item-price">${item.price}</p>
                </div>
              ))
            ) : (
              <p>+ Add menu items</p>
            )}
          </div>
        </>
      ) : (
        <div className="form-container">
          <h2>Create Menu Item</h2>
          <label className="label">Name</label>
          <input
            type="text"
            className="input-field"
            name="name"
            value={newItem.name}
            onChange={handleInputChange}
          />
          <label className="label">Price</label>
          <input
            type="text"
            className="input-field"
            name="price"
            value={newItem.price}
            onChange={handleInputChange}
          />
          <label className="label">Description</label>
          <textarea
            className="text-area"
            name="description"
            value={newItem.description}
            onChange={handleInputChange}
          />
          <label className="label">Image</label>
          <div className="image-upload">
            {newItem.image ? (
              <img src={newItem.image} alt="Menu item" />
            ) : (
              <>
                <input
                  type="file"
                  id="imageUpload"
                  onChange={handleImageUpload}
                />
                <label htmlFor="imageUpload">Drag and drop to upload file or <span>Browse</span></label>
              </>
            )}
          </div>
          <label className="label">Options</label>
          <div className="options-container">
            <div className="option-list">
              {newItem.options.map((option, index) => (
                <div key={index} className="option">
                  {option.name} +${option.price}
                  <button className="remove-button" onClick={() => handleRemoveOption(index)}>x</button>
                </div>
              ))}
            </div>
            <div className="option-input-container">
              <input
                type="text"
                placeholder="Name"
                value={optionName}
                onChange={(e) => setOptionName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Price"
                value={optionPrice}
                onChange={(e) => setOptionPrice(e.target.value)}
              />
              <button
                className="add-option-button"
                onClick={handleAddOption}
              >
                ✓
              </button>
            </div>
          </div>
          <div className="button-container">
            <button className="menu-button" onClick={() => setIsCreatingItem(false)}>Close</button>
            <button className="menu-button" onClick={handleSaveItem}>Save</button>
          </div>
        </div>
      )}

      <div className={`slide-out-panel ${selectedItem ? 'open' : ''}`}>
        {selectedItem && (
          <>
            <button className="close-button" onClick={handleClosePanel}>×</button>
            <h2 className="slide-out-title">{selectedItem.name}</h2>
            {selectedItem.image && <img className="slide-out-image" src={selectedItem.image} alt={selectedItem.name} />}
            <p className="slide-out-price">
              <strong className="slide-out-label">Price:</strong> 
              ${selectedItem.price}
            </p>
            <p className="slide-out-description">
              <strong className="slide-out-label">Description:</strong> 
              {selectedItem.description}
            </p>
            <p className="slide-out-options">
              <strong className="slide-out-label">Options:</strong>
            </p>
            <ul>
              {selectedItem.options.map((option, index) => (
                <li 
                  key={index} 
                  className={`menu-item-option ${selectedOptions.includes(option) ? 'selected' : ''}`}
                  onClick={() => toggleOption(option)}
                >
                  {option.name} +${option.price}
                </li>
              ))}
            </ul>
            <div className="slide-out-summary">
              <p><strong>Subtotal:</strong> ${calculateTotal(selectedItem.price, selectedOptions).subtotal.toFixed(2)}</p>
              <p><strong>Tax:</strong> ${calculateTotal(selectedItem.price, selectedOptions).tax.toFixed(2)}</p>
              <p><strong>Total:</strong> ${calculateTotal(selectedItem.price, selectedOptions).total.toFixed(2)}</p>
              <button className="add-button" onClick={() => handleAddMenuItem('Receipt for Table A20')}>+ Add to Table</button>
              <button className="add-button" onClick={() => handleAddMenuItem('Receipt for Takeout')}>+ Add to Takeout</button>
            </div>
          </>
        )}
      </div>
      {showReceipt && (
        <Receipt 
          receiptItems={receiptItems} 
          onAddMenuItem={() => setIsCreatingItem(false)} 
          onClose={() => setShowReceipt(false)}
          title={receiptTitle}
          onDeleteItem={handleDeleteItem}
          onUpdateQuantity={handleUpdateQuantity}
        />
      )}
    </div>
  );
};

export default Menu;
