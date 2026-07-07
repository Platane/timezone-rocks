import React from "react";
import "./global.css";
import s from "./App.module.css";
import { AvatarApp } from "../AvatarApp/AvatarApp";
import { DatePicker } from "../DatePicker/DatePicker";
import { Header } from "../Header/Header";
import { InfoDialog } from "../Info/InfoDialog";
import { Lines } from "../Lines/Lines";
import { Search } from "../Search/Search";
import type { LocationSearcher } from "@tzr/location-index";
import type { Store } from "../../store/store";
import { parseUrl, type Router } from "./router";

const usePromiseResult = <T,>(promise: Promise<T>) => {
  const [res, setRes] = React.useState<T>();
  React.useEffect(() => {
    promise.then(setRes);
  }, []);
  return res;
};

export const App = ({
  router,
  locationSearcher,
  store,
}: {
  locationSearcher: LocationSearcher;
  store: Store;
  router: Router;
}) => {
  const EarthScene = usePromiseResult(import("../Earth/Scene"))?.Scene;

  const [url, setUrl] = React.useState(parseUrl(router.getUrl()));
  React.useEffect(
    () => router.subscribe(() => setUrl(parseUrl(router.getUrl()))),
    [router]
  );

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
        onOpenChange={() => router.navigate("/", { orBack: true })}
      />
    </>
  );
};
