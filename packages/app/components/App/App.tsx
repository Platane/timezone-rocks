import React from "react";
import { useStore } from "../../store/store";
import "./global.css";
import s from "./App.module.css";
import { AvatarApp } from "../AvatarApp/AvatarApp";
import { DatePicker } from "../DatePicker/DatePicker";
import { Header } from "../Header/Header";
import { InfoDialog } from "../Info/InfoDialog";
import { Lines } from "../Lines/Lines";
import { Search } from "../Search/Search";
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

      <div className={s.topContainer}>
        <div className={s.earthContainer}>{EarthScene && <EarthScene />}</div>
      </div>

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
