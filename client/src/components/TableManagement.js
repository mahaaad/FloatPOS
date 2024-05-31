import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import DraggableTable from "./DraggableTable";
import html2canvas from "html2canvas";
import Modal from "./Modal"; // Import the new Modal component

const Grid = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
`;

export default function TableManagement() {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [gridElements, setGridElements] = useState([]);
  const [presets, setPresets] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [gridPosition, setGridPosition] = useState({ x: 0, y: 0 });
  const [cursorStyle, setCursorStyle] = useState("default");
  const [isEditMode, setIsEditMode] = useState(false); // State for edit mode
  const [selectedTable, setSelectedTable] = useState(null); // State for selected table

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [presetName, setPresetName] = useState("");

  const gridRef = useRef(null);
  const containerRef = useRef(null);

  const handleZoomLevel = (value) => {
    if (zoomLevel + value > 50 && zoomLevel + value < 150) {
      setZoomLevel(zoomLevel + value);
    }
  };

  const resetView = () => {
    setZoomLevel(100);
    setGridPosition({ x: 0, y: 0 });
  };

  const addElementToGrid = (element, position) => {
    setGridElements((prevElements) => [
      ...prevElements,
      { element, position },
    ]);
  };

  const updateElementPosition = (index, position) => {
    setGridElements((prevElements) => {
      const newElements = [...prevElements];
      newElements[index] = {
        ...newElements[index],
        position,
      };
      return newElements;
    });
  };

  const handleClearGrid = () => {
    setGridElements([]);
  };

  const handleMouseDown = (e) => {
    if (isSpacePressed) {
      setIsDragging(true);
      setCursorStyle("grabbing");
      const startX = e.clientX - gridPosition.x;
      const startY = e.clientY - gridPosition.y;
      containerRef.current = { startX, startY };
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && containerRef.current) {
      const x = e.clientX - containerRef.current.startX;
      const y = e.clientY - containerRef.current.startY;
      setGridPosition({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (isSpacePressed) {
      setCursorStyle("grab");
    } else {
      setCursorStyle("default");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      //e.preventDefault(); // Prevent the default scrolling behavior
      setIsSpacePressed(true);
      setCursorStyle("grab");
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === " ") {
      setIsSpacePressed(false);
      setCursorStyle("default");
    }
  };

  const handleClickOutside = (e) => {
    if (!gridRef.current.contains(e.target)) {
      setSelectedTable(null);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDragging]);

  const handleSavePreset = async () => {
    if (!presetName) {
      return;
    }

    // Reset view to take the snapshot
    const currentZoom = zoomLevel;
    const currentPosition = gridPosition;
    resetView();

    // Take a snapshot
    const canvas = await html2canvas(gridRef.current);
    const imgData = canvas.toDataURL("image/png");

    // Restore view
    setZoomLevel(currentZoom);
    setGridPosition(currentPosition);

    // Save the preset
    const newPreset = {
      name: presetName,
      elements: gridElements,
      zoom: currentZoom,
      position: currentPosition,
      image: imgData
    };
    setPresets([...presets, newPreset]);
    setIsModalOpen(false); // Close the modal
    setPresetName(""); // Reset the preset name
  };

  const handleLoadPreset = (preset) => {
    setGridElements(preset.elements);
    setZoomLevel(preset.zoom);
    setGridPosition(preset.position);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPresetName("");
  };

  const handlePresetNameChange = (e) => {
    setPresetName(e.target.value);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setSelectedTable(null); // Deselect any table when entering edit mode
    }
  };

  return (
    <div className="table-management">
      <div className="table-grid-wrapper">
        <div
          className={`table-grid-container ${isDragging ? "grid-animated" : "grid-normal"}`}
          onMouseDown={handleMouseDown}
        >
          <div className="table-zoom-settings">
            <button onClick={() => handleZoomLevel(10)} className="zoom-button">
              +
            </button>
            <button onClick={() => handleZoomLevel(-10)} className="zoom-button">
              -
            </button>
            <button onClick={resetView} className="zoom-button">
              {zoomLevel}%
            </button>
          </div>
          <Grid
            style={{
              transform: `scale(${zoomLevel / 100}) translate(${gridPosition.x}px, ${gridPosition.y}px)`,
              cursor: cursorStyle,
            }}
            ref={gridRef}
            className="table-grid"
          >
            {gridElements.map((item, index) => (
              <DraggableTable
                key={index}
                img={item.element.props.img}
                gridRef={gridRef}
                initialPosition={item.position}
                isInGrid={true}
                updatePosition={(position) => updateElementPosition(index, position)}
                isDraggable={isEditMode} // Pass isEditMode to control dragging
                isSelected={selectedTable === index} // Pass selected state
                onSelect={() => setSelectedTable(index)} // Handle selection
                selectedTable={selectedTable} // Pass the selectedTable state
              />
            ))}
          </Grid>
        </div>

        <div className="table-grid-options">
          <div className="table-grid-sections">
            <button className="section-button">Section 1</button>
            <div className="section-control-buttons">
              <button className="section-control-button">
                <img src="/assets/icons/add-icon.svg" />
              </button>
              <button className="section-control-button">
                <img src="/assets/icons/delete-icon.svg" />
              </button>
            </div>
          </div>
          {!isEditMode && (
            <button className="edit-button" onClick={toggleEditMode}>
              Edit
            </button>
          )}
          <div className="table-grid-control" style={{ display: isEditMode ? 'flex' : 'none' }}>
            <button className="grid-control-button">
              <img src="/assets/icons/undo-icon.svg" />
              Undo
            </button>
            <button className="grid-control-button">
              <img src="/assets/icons/redo-icon.svg" />
              Redo
            </button>
            <button className="grid-control-button" onClick={handleClearGrid}>
              <img src="/assets/icons/clear-icon.svg" />
              Clear
            </button>
            <button className="grid-control-button" onClick={toggleEditMode}>
              <img src="/assets/icons/ok-icon.svg" />
              Done
            </button>
          </div>
        </div>
      </div>

      <div className="table-presets" style={{ display: isEditMode ? 'block' : 'none' }}>
        <h3 className="edit-tables-title">Edit Tables</h3>
        <div className="table-options">
          <div className="table-option">
            <DraggableTable
              img="/assets/icons/tables/round-table.svg"
              gridRef={gridRef}
              addElementToGrid={addElementToGrid}
              resetOnDrop
              isDraggable={isEditMode} // Pass isEditMode to control dragging
            />
          </div>
          <div className="table-option">
            <DraggableTable
              img="/assets/icons/tables/square-table.svg"
              gridRef={gridRef}
              addElementToGrid={addElementToGrid}
              resetOnDrop
              isDraggable={isEditMode} // Pass isEditMode to control dragging
            />
          </div>
          <div className="table-option">
            <DraggableTable
              img="/assets/icons/tables/wide-rectangle-table.svg"
              gridRef={gridRef}
              addElementToGrid={addElementToGrid}
              resetOnDrop
              isDraggable={isEditMode} // Pass isEditMode to control dragging
            />
          </div>
          <div className="table-option">
            <DraggableTable
              img="/assets/icons/tables/long-rectangle-table.svg"
              gridRef={gridRef}
              addElementToGrid={addElementToGrid}
              resetOnDrop
              isDraggable={isEditMode} // Pass isEditMode to control dragging
            />
          </div>
        </div>
        <h3 className="presets-title">Presets</h3>
        <div className="saved-presets" style={{ overflowY: 'scroll', maxHeight: '80%' }}>
          {presets.length === 0 ? (
            <p style={{width: '80%', textAlign: 'center'}}>You currently have no saved presets. Presets will show up here when you create some.</p>
          ) : (
            <ul className="preset-list">
              {presets.map((preset, index) => (
                <li className="preset" key={index} onClick={() => handleLoadPreset(preset)} style={{ cursor: 'pointer' }}>
                  <img className="preset-preview" src={preset.image} alt={preset.name} />
                  <p className="preset-name">{preset.name}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="preset-buttons">
          <button className="preset-button" onClick={openModal}>Save Preset</button>
        </div>
      </div>

      {/* main right menu */}
      <div className="default-right-menu" style={{ display: isEditMode ? 'none' : 'flex' }}>
        <div className="reservation-controls">
          <button className="control-button">+ Dine in</button>
          <button className="control-button">+ Take Out</button>
          <button className="control-button">+ Reservation</button>
        </div>

        <div className="upcoming-reservations" >
          <h3 style={{textAlign: 'center'}}>Upcoming Reservations</h3>
          <ul>
            <li>6:45 PM - Malick Ahmed - A20</li>
            <li>7:15 PM - Mahad Rehan - C11</li>
            <li>9:45 PM - Ryan Reynolds - F1</li>
          </ul>
        </div>
      </div>
      <Modal
        show={isModalOpen}
        onClose={closeModal}
        prompt="Enter preset name:"
        inputValue={presetName}
        onInputChange={handlePresetNameChange}
        onSave={handleSavePreset}
      />
    </div>
  );
}
