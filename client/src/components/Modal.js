import React from 'react';
import styled from 'styled-components';

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const Prompt = styled.p`
  font-size: 16px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 90%;
  padding: 10px;
  margin-top: 10px;
  font-size: 24px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  font-size: 16px;
  background-color: #0ACDFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Modal = ({ show, onClose, prompt, inputValue, onInputChange, onSave }) => {
  if (!show) return null;

  return (
    <ModalBackground>
      <ModalContainer>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Prompt>{prompt}</Prompt>
        <Input type="text" value={inputValue} onChange={onInputChange} />
        <Button onClick={onSave}>Save</Button>
      </ModalContainer>
    </ModalBackground>
  );
};

export default Modal;
