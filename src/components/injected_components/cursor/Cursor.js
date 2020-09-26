import React from 'react';
import styled from 'styled-components';

const CursorContainer = styled.div`
	position: absolute;
	z-index: 100000001;
	top: 0;
	left: 0;
	border-radius: 50%;
	background-color: ${props => props.color};
	height: ${props => props.radius * 2}px;
	width: ${props => props.radius * 2}px;
	transition: transform 0.2s ease-out;
`;

const Cursor = ({ color, radius }) => {
	return <CursorContainer id='cursor' color={color} radius={radius} />;
};

export default Cursor;
