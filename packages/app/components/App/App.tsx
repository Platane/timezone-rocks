import React from "react";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";
import loadable from "@loadable/component";
import { Lines } from "../Lines/Lines";
import { Search } from "../Search";
import { useStore } from "../../store/store";
import { DatePicker } from "../DatePicker";
import { InfoDialog } from "../Info/InfoDialog";
import { useNavigate, useUrl } from "./router";
import { Header } from "../Header/Header";
import { AvatarApp } from "../AvatarApp/AvatarApp";

const LazyEarthScene = loadable(() => import("../Earth/Scene"));
LazyEarthScene.preload();

export const App = () => {
  const locationStoreReady = useStore((s) => s.locationStoreReady);

  const url = useUrl();
  const navigate = useNavigate();

  if (url === "/avatar") return <AvatarApp />;

  if (!locationStoreReady) return null;

  return (
    <>
      <Header />

      <TopContainer>
        <EarthContainer>
          <LazyEarthScene />
        </EarthContainer>
      </TopContainer>

      <Search />

      <DatePicker />

      <Lines />

      <InfoDialog
        open={url === "/about"}
        onOpenChange={() => navigate("/", { orBack: true })}
      />
    </>
  );
};

export const globals = css`
  :global() {
    html {
      box-sizing: border-box;
      user-select: none;
      font-family: Helvetica, Arial, sans-serif;
      background-color: #203b53;
    }

    body {
      margin: 0;
    }

    *,
    *:before,
    *:after {
      box-sizing: inherit;
      user-select: inherit;
    }

    @media (max-width: 500px) {
      #root {
        padding-bottom: 360px;
      }
    }
  }
`;

const TopContainer = styled.div`
  width: 100%;
  overflow: hidden;
`;
const EarthContainer = styled.div`
  position: relative;
  height: 500px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 500px) {
    height: 300px;
    max-width: 400px;
  }
`;
