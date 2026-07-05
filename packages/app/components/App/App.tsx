import React from "react";
import "./global.css";
import s from "./App.module.css";
import { AvatarApp } from "../AvatarApp/AvatarApp";
import { DatePicker } from "../DatePicker/DatePicker";
import { Header } from "../Header/Header";
import { InfoDialog } from "../Info/InfoDialog";
import { Lines } from "../Lines/Lines";
import { Search } from "../Search/Search";
import { useNavigate, useUrl } from "./router";
import { LocationSearcher } from "@tzr/location-index";
import { Store } from "../../store/store";

const usePromiseResult = <T,>(promise: Promise<T>) => {
  const [res, setRes] = React.useState<T>();
  React.useEffect(() => {
    promise.then(setRes);
  }, []);
  return res;
};

export const App = ({
  locationSearcher,
  store,
}: {
  locationSearcher: LocationSearcher;
  store: Store;
}) => {
  const EarthScene = usePromiseResult(import("../Earth/Scene"))?.Scene;

  const url = useUrl();
  const navigate = useNavigate();

  if (url === "/avatar") return <AvatarApp />;

  return (
    <>
      <Header />

      <div className={s.topContainer}>
        <div className={s.earthContainer}>
          {EarthScene && <EarthScene store={store} />}
        </div>
      </div>

      <Search store={store} locationSearcher={locationSearcher} />

      <DatePicker store={store} />

      <Lines store={store} />

      <InfoDialog
        open={url === "/about"}
        onOpenChange={() => navigate("/", { orBack: true })}
      />
    </>
  );
};
