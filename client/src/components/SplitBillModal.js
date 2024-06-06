import React, { useState } from 'react';
import CustomModal from './CustomModal';
import '../style/splitBillModal.scss';

const SplitBillModal = ({ isOpen, onRequestClose, receiptItems, onSplitReceiptsUpdate }) => {
  const [splitReceipts, setSplitReceipts] = useState([{ id: 'receipt-1', items: [] }]);
  const [isSplitAmongstModalOpen, setIsSplitAmongstModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedReceipts, setSelectedReceipts] = useState([]);

  const addNewReceipt = () => {
    setSplitReceipts([...splitReceipts, { id: `receipt-${splitReceipts.length + 1}`, items: [] }]);
  };

  const handleDragStart = (e, item, sourceReceiptIndex) => {
    e.dataTransfer.setData('item', JSON.stringify(item));
    e.dataTransfer.setData('sourceReceiptIndex', sourceReceiptIndex);
  };

  const handleDrop = (e, destinationReceiptIndex) => {
    const item = JSON.parse(e.dataTransfer.getData('item'));
    const sourceReceiptIndex = e.dataTransfer.getData('sourceReceiptIndex');

    const newSplitReceipts = [...splitReceipts];
    newSplitReceipts[sourceReceiptIndex].items = newSplitReceipts[sourceReceiptIndex].items.filter(
      (i) => i.id !== item.id
    );
    newSplitReceipts[destinationReceiptIndex].items.push(item);

    setSplitReceipts(newSplitReceipts);
    onSplitReceiptsUpdate(newSplitReceipts);
  };

  const handleSplitEvenly = (item) => {
    const newSplitReceipts = splitReceipts.map(receipt => ({
      ...receipt,
      items: [...receipt.items, { ...item, price: item.price / splitReceipts.length }]
    }));

    setSplitReceipts(newSplitReceipts);
    onSplitReceiptsUpdate(newSplitReceipts);
  };

  const handleSplitAmongst = (item) => {
    setSelectedItem(item);
    setIsSplitAmongstModalOpen(true);
  };

  const handleSplitAmongstConfirm = () => {
    const splitPrice = selectedItem.price / selectedReceipts.length;
    const newSplitReceipts = splitReceipts.map(receipt => {
      if (selectedReceipts.includes(receipt.id)) {
        return {
          ...receipt,
          items: [...receipt.items, { ...selectedItem, price: splitPrice }]
        };
      }
      return receipt;
    });

    setSplitReceipts(newSplitReceipts);
    onSplitReceiptsUpdate(newSplitReceipts);
    setIsSplitAmongstModalOpen(false);
  };

  const handleReceiptSelection = (receiptId) => {
    setSelectedReceipts(prev =>
      prev.includes(receiptId) ? prev.filter(id => id !== receiptId) : [...prev, receiptId]
    );
  };

  return (
    <>
      <CustomModal isOpen={isOpen} onRequestClose={onRequestClose}>
        <h2>Split Bill</h2>
        <div className="split-bill-container">
          <div className="original-items">
            {receiptItems.map((item, index) => (
              <div key={item.id} className="receipt-item">
                {item.name} - ${item.price.toFixed(2)}
                <button onClick={() => handleSplitEvenly(item)}>split evenly</button>
                <button onClick={() => handleSplitAmongst(item)}>split amongst</button>
              </div>
            ))}
          </div>
          <div className="split-receipts">
            {splitReceipts.map((receipt, receiptIndex) => (
              <div
                key={receipt.id}
                className="split-receipt"
                onDrop={(e) => handleDrop(e, receiptIndex)}
                onDragOver={(e) => e.preventDefault()}
              >
                <h3>{receipt.id}</h3>
                {receipt.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="receipt-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, item, receiptIndex)}
                  >
                    {item.name} - ${item.price.toFixed(2)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <button onClick={addNewReceipt} className="add-receipt-button">+ Add Bill</button>
      </CustomModal>
      <CustomModal isOpen={isSplitAmongstModalOpen} onRequestClose={() => setIsSplitAmongstModalOpen(false)}>
        <h2>Select Receipts to Split Amongst</h2>
        <div className="split-amongst-container">
          {splitReceipts.map(receipt => (
            <div key={receipt.id} className="split-amongst-receipt">
              <label>
                <input
                  type="checkbox"
                  checked={selectedReceipts.includes(receipt.id)}
                  onChange={() => handleReceiptSelection(receipt.id)}
                />
                {receipt.id}
              </label>
            </div>
          ))}
        </div>
        <button onClick={handleSplitAmongstConfirm} className="confirm-split-button">Confirm</button>
      </CustomModal>
    </>
  );
};

export default SplitBillModal;
