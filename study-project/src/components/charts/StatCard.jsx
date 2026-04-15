import React from "react";
import styled from "styled-components";

const StatCardContainer = styled.div`
	background: white;
	border-radius: 20px;
	padding: 24px;
	width: 250px;

	box-shadow: 0 4px 20px ${(props) => props.shadowColor || "rgba(0,0,0,0.1)"};

	display: flex;
	flex-direction: column;
	transition: all 0.25s ease;

	&:hover {
		transform: translateY(-6px);
		box-shadow: 0 10px 30px ${(props) => props.shadowColor || "rgba(0,0,0,0.15)"};
	}
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const Title = styled.div`
	font-size: 14px;
	color: ${(props) => props.color || "#888"};
`;

const Value = styled.div`
font-size:28px;
font-weight:bold;
color #222;`;

const IconWrapper = styled.div`
	font-size: 22px;
	color: ${(props) => props.color};
`;

function StatCard({ title, value, color, icon: Icon }) {
	return (
		<StatCardContainer shadowColor={color}>
			<Header>
				<Title color={color}>{title}</Title>
				<IconWrapper color={color}>
					<Icon />
				</IconWrapper>
			</Header>
			<Value>{value}</Value>
		</StatCardContainer>
	);
}

export default StatCard;
