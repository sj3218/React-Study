import Header from "./Header";
import Footer from "./Footer";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

const PageContainer = styled.div`
	display: flex;
	flex-direction: row;
	min-height: 100vh;
`;

const HeaderContainer = styled.div`
	background: yellowgreen;
	color: white;
	justify-content: flex-start;
	display: flex;
	height: 100px;
	width: 100%;
	padding-left: 10px;
	border-bottom: 1px solid #d6d5d5;
`;

const FooterContainer = styled.div`
	background: yellowgreen;
	color: black;
	justify-content: flex-end;
	display: flex;
	height: 80px;
	padding-left: 10px;
	border-bottom: 1px solid #d6d5d5;
`;

function Layout({ title, footerMessage, menuList }) {
	return (
		<div>
			<HeaderContainer>
				<Header title={title} />
			</HeaderContainer>
			<PageContainer>
				<SideBar menuList={menuList} />
				<Outlet />
			</PageContainer>
			<FooterContainer>
				<Footer message={footerMessage} />
			</FooterContainer>
		</div>
	);
}

export default Layout;
