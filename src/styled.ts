import styled from "styled-components";

export const BubbleContainer = styled.div`
  position: absolute;
  background: #ddd;
  top: 5%;
  left: 5%;
  width: 90%;
  height: 90%;
`;

const size = 50;
export const Bubble = styled.div`
  position: absolute;
  background: red;
  width: ${size}px;
  height: ${size}px;
  top: 50%;
  left: 50%;
  border-radius: ${size}px;
  background-position: center right;
  background-size: cover;
  background-color: #fff;
  box-shadow: 1px 1px 7px rgbq(0, 0, 0, 0.7);
`;
