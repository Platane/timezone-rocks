import { create, StateCreator } from "zustand";

const parseUrl = (pathname: string) => {
  if (pathname === "/avatar") return "/avatar" as const;
  if (pathname === "/about") return "/about" as const;
  return "/" as const;
};

type Route = ReturnType<typeof parseUrl>;

const initialUrl = parseUrl(window.location.pathname);

if (initialUrl !== window.location.pathname) {
  history.replaceState({}, "", initialUrl);
}

const urlStore = create(() => ({ url: initialUrl }));

window.addEventListener("popstate", () => {
  const url = parseUrl(window.location.pathname);
  urlStore.setState({ url });
});

const navigate = (
  pathname: Route,
  options: { replace?: boolean; orBack?: boolean }
) => {
  const internalHistory: string[] = history.state?.internalHistory ?? [];

  let i = 0;
  if (options.orBack && (i = internalHistory.lastIndexOf(pathname)) !== -1) {
    history.go(-(internalHistory.length - i));
  } else {
    const m = options?.replace ? "replaceState" : "pushState";

    const nextInternalHistory = options?.replace
      ? [...internalHistory.slice(0, -1), window.location.pathname]
      : [...internalHistory, window.location.pathname];

    const url = new URL(
      pathname + window.location.hash,
      window.location.origin
    ).toString();

    history[m]({ internalHistory: nextInternalHistory }, "", url);
  }

  urlStore.setState({ url: pathname });
};

/**
 * intercept click event on anchor element
 * prevent default and call navigate instead
 */
document.addEventListener("click", (event) => {
  let el = event.target as HTMLElement | null;
  while (el && !isAnchorElement(el)) el = el.parentElement;

  if (
    isAnchorElement(el) &&
    !event.ctrlKey &&
    !event.altKey &&
    event.button === 0 &&
    !event.defaultPrevented &&
    !(el.target === "_blank") &&
    isInternalUrl(el.href)
  ) {
    event.preventDefault();
    const { pathname } = new URL(el.href);
    navigate(pathname as Route, {
      replace: !!el.hasAttribute("data-replace"),
      orBack: !!el.hasAttribute("data-or-back"),
    });
  }
});

const isAnchorElement = (x: any): x is HTMLAnchorElement => x?.nodeName === "A";

const isInternalUrl = (href: string) => {
  const u = new URL(href, window.location.href);
  return u.origin === window.location.origin;
};

export const useUrl = () => urlStore().url;
export const useNavigate = () => navigate;
