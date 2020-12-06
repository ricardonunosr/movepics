import styled, { css } from 'styled-components';
import { Minimize as MinimizeIcon } from '@styled-icons/material/Minimize';
import { Close as CloseIcon } from '@styled-icons/evaicons-solid/Close';
import { Spinner2 as SpinnerIcon } from '@styled-icons/evil/Spinner2';

export const Main = styled.div`
  width: 90%;
  height: 90%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;
export const Button = styled.button`
  border: 1px solid #c4c4c4;
  border-radius: 25px;
  padding: 6px 20px;
  width: 100%;
  min-height: 85px;
  font-size: 24px;
  background-color: transparent;
  color: #c4c4c4;
  text-align: left;
  cursor: pointer;
  &:hover {
    background-color: #8d8d8d;
  }
`;
export const StartButton = styled(Button)`
  min-height: 85px;
  min-width: 250px;
  font-size: 48px;
  width: auto;
  text-align: center;
  color: black;
`;

export const WindowControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  background-color: gray;
  height: 5%;
  -webkit-user-select: none;
  -webkit-app-region: drag;
`;

const WindowButton = css`
  width: 60px;
  height: 100%;
  background-color: transparent;
  font-size: 20px;
  color: white;
  cursor: pointer;
  -webkit-app-region: no-drag;
`;

export const Minimize = styled(MinimizeIcon)`
  ${WindowButton}
  &:hover {
    background-color: #8d8d8d;
  }
`;

export const Close = styled(CloseIcon)`
  ${WindowButton}
  &:hover {
    background-color: red;
  }
`;

export const Spinner = styled(SpinnerIcon)`
  width: 50px;
  height: 50px;
  animation: rotate 2s linear infinite;
  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const ToogleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ToogleWrapper = styled.div`
  position: relative;
`;

export const ToogleLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: #bebebe;
  cursor: pointer;
  &::after {
    content: '';
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`;

export const Toogle = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  height: 26px;
  &:checked + ${ToogleLabel} {
    //background: #4fbe79;
    &::after {
      content: '';
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
`;

export const ErrorMessage = styled.p`
  color: red;
`;
