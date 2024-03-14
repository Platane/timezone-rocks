import { styled } from "@linaria/react";
import githubLogoUrl from "./github-mark-white.svg";
import infoUrl from "./info.svg";
import avatarUrl from "./avatar.svg";

export const Header = () => (
  <Container>
    <Link
      href="https://github.com/Platane/timezone-rocks"
      title="github repository"
    >
      <Icon src={githubLogoUrl} alt="github logo" />
    </Link>

    <Link href="/about" title="about">
      <Icon src={infoUrl} alt="info icon" />
    </Link>

    <Link href="/avatar" title="avatar animation">
      <Icon src={avatarUrl} alt="avatar icon" />
    </Link>
  </Container>
);

const Link = styled.a`
display: flex;

opacity:0.6;
border-radius: 50%;

&:hover,
&:focus-visible{
    opacity:1;
}
pointer-events: auto;
`;

const Container = styled.header`
position:fixed;
top:0;
right:0;
display: flex;
flex-direction: row;
gap:24px;
padding: 8px 24px;
z-index: 10;
pointer-events: none;
`;

const Icon = styled.img`
width:24px;
height:24px;
`;
