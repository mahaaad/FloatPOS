import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Draggable from "react-draggable";

const TableImg = styled.img`
  width: 60%;
  height: 60%;
  pointer-events: none;                  
`;

export default function DraggableTable({
  img,
  gridRef,
  addElementToGrid,
  updatePosition,
  initialPosition = { x: 0, y: 0 },
  isInGrid = false,
  resetOnDrop = false,
  isDraggable = true, 
  isSelected,
  onSelect,
  selectedTable
}) {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const draggableRef = useRef(null);

  useEffect(() => {
    if (!isDraggable) {
      setDragging(false);
    }
  }, [isDraggable]);

  const handleDragStop = (e, data) => {
    const gridRect = gridRef.current.getBoundingClientRect();
    const draggableRect = draggableRef.current.getBoundingClientRect();

    if (
      draggableRect.left >= gridRect.left &&
      draggableRect.right <= gridRect.right &&
      draggableRect.top >= gridRect.top &&
      draggableRect.bottom <= gridRect.bottom
    ) {
 
      const newX = draggableRect.left - gridRect.left;
      const newY = draggableRect.top - gridRect.top;

      if (isInGrid) {
        setPosition({ x: newX, y: newY });
        if (updatePosition) {
          updatePosition({ x: newX, y: newY });
        }
      } else {
        addElementToGrid(
          <DraggableTable
            img={img}
            gridRef={gridRef}
            addElementToGrid={addElementToGrid}
            updatePosition={updatePosition}
            initialPosition={{ x: newX, y: newY }}
            isInGrid={true}
            isDraggable={isDraggable}
            isSelected={isSelected}
            onSelect={onSelect}
            selectedTable={selectedTable}
          />,
          { x: newX, y: newY }
        );
        if (resetOnDrop) {
          setPosition({ x: 0, y: 0 });
        }
      }
    } else {

      setPosition(initialPosition);
    }

    setDragging(false);
  };

  return (
    <Draggable
      nodeRef={draggableRef}
      onStart={() => isDraggable && setDragging(true)}
      onStop={isDraggable ? handleDragStop : null}
      position={position}
      disabled={!isDraggable}
    >
      <div
        ref={draggableRef}
        className={`draggable-content ${dragging ? "dragging" : ""}`}
        style={{
          cursor: 'pointer',
          opacity: isSelected || selectedTable === null ? 1 : 0.5,
          marginTop: isSelected ? '-2rem' : '0',
          transition: isSelected ? "margin-top 0.35s" : "none",
        }}
        onClick={() => !isDraggable && onSelect()} // Only selectable when not draggable
      >
        <img className="draggable-icon" src="/assets/icons/draggable-icon.svg" alt="draggable icon" />
        <TableImg src={img} />
        {isSelected && !isDraggable && (
          <div className="table-menu">
            <p className="table-number">#20</p>
            <p className="table-count">4 people</p>
            <p className="table-server">served by Mahad R.</p>
            <button className="table-add-button">+</button>
            <button className="table-checkout-button">checkout</button>
          </div>
        )}
      </div>
    </Draggable>
  );
}
