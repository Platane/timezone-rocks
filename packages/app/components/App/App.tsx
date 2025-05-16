import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import React from "react";
import { useStore } from "../../store/store";
import { AvatarApp } from "../AvatarApp/AvatarApp";
import { DatePicker } from "../DatePicker";
import { Header } from "../Header/Header";
import { InfoDialog } from "../Info/InfoDialog";
import { Lines } from "../Lines/Lines";
import { Search } from "../Search";
import { useNavigate, useUrl } from "./router";

const usePromiseResult = <T,>(promise: Promise<T>) => {
  const [res, setRes] = React.useState<T>();
  React.useEffect(() => {
    promise.then(setRes);
  }, []);
  return res;
};

export const App = () => {
  const locationStoreReady = useStore((s) => s.locationStoreReady);

  const EarthScene = usePromiseResult(import("../Earth/Scene"))?.Scene;

  const url = useUrl();
  const navigate = useNavigate();

  if (url === "/avatar") return <AvatarApp />;

  if (!locationStoreReady) return null;

  return (
    <>
      <Header />

      <TopContainer>
        <EarthContainer>{EarthScene && <EarthScene />}</EarthContainer>
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
