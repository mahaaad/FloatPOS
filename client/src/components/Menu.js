import React, { useState } from 'react';
import '../style/menu.scss';
import Receipt from './Receipt';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [menuPages, setMenuPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({
    id: null, name: '', price: '', cost: '', description: '', image: '', options: [], isInventory: false, quantity: '', pages: []
  });
  const [optionName, setOptionName] = useState('');
  const [optionPrice, setOptionPrice] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [receiptItems, setReceiptItems] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptTitle, setReceiptTitle] = useState('Receipt for Table A20');
  const [masterToppings, setMasterToppings] = useState([]); // Master list of all toppings

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "cost" && !/^\d*\.?\d*$/.test(value)) {
      return;
    }

    setNewItem({ ...newItem, [name]: value });
  };

  const handleCheckboxChange = () => {
    setNewItem({ ...newItem, isInventory: !newItem.isInventory, quantity: '' });
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
    const itemWithPages = { 
      ...newItem, 
      id: Date.now(),  // Add a unique ID based on timestamp
      pages: [...newItem.pages, "All"] 
    };
    setMenuItems([...menuItems, itemWithPages]);
    setNewItem({
      id: null, name: '', price: '', cost: '', description: '', image: '', options: [], isInventory: false, quantity: '', pages: []
    });
    setIsCreatingItem(false);
  };

  const handleAddOption = () => {
    const newOption = { name: optionName, price: optionPrice };

    // Add option to the menu item
    setNewItem({ ...newItem, options: [...newItem.options, newOption] });
    setOptionName('');
    setOptionPrice('');

    // Update master toppings list if the option is unique
    const isOptionNew = !masterToppings.some(
      (topping) => topping.name === newOption.name && topping.price === newOption.price
    );
    if (isOptionNew) {
      setMasterToppings([...masterToppings, newOption]);
    }
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = newItem.options.filter((_, i) => i !== index);
    setNewItem({ ...newItem, options: updatedOptions });
  };

  const handleCreatePage = () => {
    setMenuPages([...menuPages, { name: newPageName }]);
    setNewPageName('');
    setIsCreatingPage(false);
  };

  const handlePageSelect = (pageName) => {
    setNewItem((prevItem) => ({
      ...prevItem,
      pages: prevItem.pages.includes(pageName)
        ? prevItem.pages.filter((page) => page !== pageName)
        : [...prevItem.pages, pageName],
    }));
  };

  const handleRemoveFromPage = (item, pageName) => {
    const updatedItems = menuItems.map(menuItem =>
      menuItem.id === item.id
        ? { ...menuItem, pages: menuItem.pages.filter(page => page !== pageName) }
        : menuItem
    );
    setMenuItems(updatedItems);
  };

  const displayItems = selectedPage && selectedPage.name === "All" 
    ? menuItems
    : menuItems.filter((item) => item.pages.includes(selectedPage?.name));

  const handleItemClick = (item) => {
    setSelectedItem({ ...item });
    setSelectedOptions([]);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const handleImageEditUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedItem((prevItem) => ({ ...prevItem, image: reader.result }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handlePageSelectionChange = (pageName) => {
    setSelectedItem((prevItem) => ({
      ...prevItem,
      pages: prevItem.pages.includes(pageName)
        ? prevItem.pages.filter((page) => page !== pageName)
        : [...prevItem.pages, pageName],
    }));
  };

  const handleSaveEdits = () => {
    const updatedItems = menuItems.map((item) =>
      item.id === selectedItem.id ? selectedItem : item
    );
    setMenuItems(updatedItems);
    setSelectedItem(null);
  };

  const handleClosePanel = () => {
    setSelectedItem(null);
    setSelectedOptions([]);
  };

  return (
    <div className="menu-container">
      {!isCreatingItem && !isCreatingPage ? (
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
              <button className="menu-button" onClick={() => setIsCreatingPage(true)}>+ Create Menu Page</button>
            </div>
          </div>

          {/* Menu Page Tabs */}
          <div className="menu-pages">
            <button
              className={`menu-page-button ${selectedPage?.name === "All" ? 'active' : ''}`}
              onClick={() => setSelectedPage({ name: "All" })}
            >
              All
            </button>
            {menuPages.map((page, index) => (
              <button
                key={index}
                className={`menu-page-button ${selectedPage?.name === page.name ? 'active' : ''}`}
                onClick={() => setSelectedPage(page)}
              >
                {page.name}
              </button>
            ))}
          </div>

          <div className="menu-list">
            {displayItems.length > 0 ? (
              displayItems.map((item, index) => (
                <div key={item.id} className="menu-item" onClick={() => handleItemClick(item)}>
                  {item.image && <img src={item.image} alt={item.name} />}
                  <h4 className="menu-item-name">{item.name}</h4>
                  <p className="menu-item-price">${item.price}</p>
                  {selectedPage && selectedPage.name !== "All" && (
                    <button
                      className="remove-from-page-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromPage(item, selectedPage.name);
                      }}
                    >
                      Remove from {selectedPage.name}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>{selectedPage?.name === "All" ? "No items available" : `+ Add items to ${selectedPage?.name} page`}</p>
            )}
          </div>
        </>
      ) : isCreatingPage ? (
        <div className="form-container">
          <h2>Create Menu Page</h2>
          <label className="label">Page Name</label>
          <input
            type="text"
            className="input-field"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
          />
          <div className="button-container">
            <button className="menu-button" onClick={() => setIsCreatingPage(false)}>Cancel</button>
            <button className="menu-button" onClick={handleCreatePage}>Create Page</button>
          </div>
        </div>
      ) : (
        <div className="form-container">
          <h2>Create Menu Item</h2>
          <label className="label">Inventory Item</label>
          <input
            type="checkbox"
            className="input-field"
            checked={newItem.isInventory}
            onChange={handleCheckboxChange}
          />
          {newItem.isInventory && (
            <>
              <label className="label">Quantity</label>
              <input
                type="number"
                className="input-field"
                name="quantity"
                value={newItem.quantity}
                onChange={handleInputChange}
              />
            </>
          )}
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
          <label className="label">Cost</label>
          <input
            type="text"
            className="input-field"
            name="cost"
            value={newItem.cost}
            onChange={handleInputChange}
          />
          <label className="label">Description</label>
          <textarea
            className="text-area"
            name="description"
            value={newItem.description}
            onChange={handleInputChange}
          />

          {/* Image Upload Field */}
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

          {/* Page Selection */}
          <label className="label">Select Pages</label>
          <div className="page-selection">
            {menuPages.map((page, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  checked={newItem.pages.includes(page.name)}
                  onChange={() => handlePageSelect(page.name)}
                />
                {page.name}
              </label>
            ))}
          </div>

          {/* Master Toppings Selection */}
          <label className="label">Add Options</label>
          <div className="options-container">
            <select
              onChange={(e) => {
                const selectedTopping = masterToppings.find(
                  (topping) => topping.name === e.target.value
                );
                if (selectedTopping) {
                  setNewItem({ 
                    ...newItem, 
                    options: [...newItem.options, selectedTopping] 
                  });
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>Select from Master Toppings</option>
              {masterToppings.map((topping, index) => (
                <option key={index} value={topping.name}>
                  {topping.name} +${topping.price}
                </option>
              ))}
            </select>
            <div className="option-input-container">
              <input
                type="text"
                placeholder="New Option Name"
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
            <h2 className="slide-out-title">Edit Menu Item</h2>
            <label>Name</label>
            <input
              type="text"
              className="input-field"
              name="name"
              value={selectedItem.name}
              onChange={handleEditChange}
            />
            <label>Price</label>
            <input
              type="text"
              className="input-field"
              name="price"
              value={selectedItem.price}
              onChange={handleEditChange}
            />
            <label>Cost</label>
            <input
              type="text"
              className="input-field"
              name="cost"
              value={selectedItem.cost}
              onChange={handleEditChange}
            />
            <label>Description</label>
            <textarea
              className="text-area"
              name="description"
              value={selectedItem.description}
              onChange={handleEditChange}
            />
            {selectedItem.isInventory && (
              <>
                <label>Quantity</label>
                <input
                  type="number"
                  className="input-field"
                  name="quantity"
                  value={selectedItem.quantity}
                  onChange={handleEditChange}
                />
              </>
            )}
            <label>Pages</label>
            <div className="page-selection">
              {menuPages.map((page, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    checked={selectedItem.pages.includes(page.name)}
                    onChange={() => handlePageSelectionChange(page.name)}
                  />
                  {page.name}
                </label>
              ))}
            </div>
            <label>Image</label>
            <div className="image-upload">
              {selectedItem.image ? (
                <img src={selectedItem.image} alt="Menu item" />
              ) : (
                <>
                  <input
                    type="file"
                    id="imageEditUpload"
                    onChange={handleImageEditUpload}
                  />
                  <label htmlFor="imageEditUpload">Drag and drop to upload file or <span>Browse</span></label>
                </>
              )}
            </div>
            <button className="menu-button" onClick={handleSaveEdits}>Save Changes</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;
