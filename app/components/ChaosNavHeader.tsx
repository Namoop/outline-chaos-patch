import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import breakpoint from "styled-components-breakpoint";
import { depths, s } from "@shared/styles";

const navItems = [
  { label: "Trips", to: "/s/trips" },
  { label: "Home", to: "/s/home" },
  { label: "Events", to: "/s/events" },
  { label: "Gear", href: "https://www.chaosberkeley.org/trip-planning/" },
  { label: "Join", href: "https://www.chaosberkeley.org/how-to-join/" },
  { label: "FAQ", href: "https://www.chaosberkeley.org/faq/" },
];

/**
 * Global CHAOS navigation header shown above the Outline app.
 *
 * @returns the global navigation header.
 */
export function ChaosNavHeader() {
  return (
    <Header>
      <Brand to="/s/home" aria-label="CHAOS home">
        <BrandMark>CHAOS</BrandMark>
        <BrandText>Cal Hiking and Outdoor Society</BrandText>
      </Brand>
      <Nav aria-label="CHAOS">
        {navItems.map((item) =>
          "to" in item ? (
            <NavLink key={item.label} to={item.to}>
              {item.label}
            </NavLink>
          ) : (
            <ExternalLink
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
            >
              {item.label}
            </ExternalLink>
          )
        )}
      </Nav>
    </Header>
  );
}

const Header = styled.header`
  position: fixed;
  inset: 0 0 auto;
  z-index: ${depths.sidebar + 1};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: var(--chaos-header-height);
  padding: 0 18px;
  border-bottom: 1px solid ${s("divider")};
  background: ${s("background")};
  color: ${s("text")};

  @media print {
    display: none;
  }
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
  color: ${s("text")};
  font-weight: 650;
  white-space: nowrap;
`;

const BrandMark = styled.span`
  font-size: 18px;
  letter-spacing: 0.08em;
`;

const BrandText = styled.span`
  display: none;
  color: ${s("textSecondary")};
  font-size: 13px;
  font-weight: 500;

  ${breakpoint("tablet")`
    display: inline;
  `}
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const linkStyles = css`
  display: inline-flex;
  align-items: center;
  height: 34px;
  padding: 0 10px;
  border-radius: 6px;
  white-space: nowrap;
  color: ${s("textSecondary")};
  font-size: 14px;
  font-weight: 550;

  &:hover {
    background: ${s("sidebarHoverBackground")};
    color: ${s("text")};
  }
`;

const NavLink = styled(Link)`
  ${linkStyles}
`;

const ExternalLink = styled.a`
  ${linkStyles}
`;
