import { Link } from "react-router-dom";
import styled from "styled-components";

const SideBarContainer = styled.nav`
	background: #ceffe1;
	width: 200px;
	display: flex;
	flex-direction: column;
	height: 100%;
	color: black;
`;

const SideBarItem = styled.div`
	font-size: 20px;
	padding-bottom: 7px;
	text-align: center;

	&:hover {
		background: #a5ccb4;
		color: white;
	}
`;

const SideBarLink = styled(Link)`
    text-decoration: none;
    color: black;
    padding: 0.5px;
    display: block;
    transition:0.3s;

    &:hover{
        background: #888
        color: white}
`;

function SideBar({ menuList }) {
	return (
		<div>
			<SideBarContainer>
				{menuList.map((menu, index) => (
					<SideBarItem key={index}>
						<SideBarLink to={menu.url}>
							<span>{menu.title}</span>
						</SideBarLink>
					</SideBarItem>
				))}
			</SideBarContainer>
		</div>
	);
}

export default SideBar;
