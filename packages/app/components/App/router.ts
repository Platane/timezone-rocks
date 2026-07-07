export const parseUrl = (url: string) => {
  const { pathname } = new URL(url, "http://a");

  if (pathname === "/avatar") return "/avatar" as const;
  if (pathname === "/about") return "/about" as const;
  return "/" as const;
};

type Route = ReturnType<typeof parseUrl>;

const navigate = (
  pathname: string,
  options: { replace?: boolean; orBack?: boolean }
) => {
  const internalHistory: string[] = history.state?.internalHistory ?? [];

  if (options.orBack) {
    const lastIndex = internalHistory.lastIndexOf(pathname);

    if (lastIndex !== -1) {
      history.go(-(internalHistory.length - lastIndex));
      return;
    }
  }

  const m = options?.replace ? "replaceState" : "pushState";

  const nextState = {
    ...history.state,
    internalHistory: [
      ...(options?.replace ? internalHistory.slice(0, -1) : internalHistory),
      window.location.pathname,
    ],
  };

  const nextUrl = pathname + window.location.hash;

  if (options.replace) {
    history.replaceState(nextState, "", nextUrl);
  } else {
    history.pushState(nextState, "", nextUrl);
  }

  window.dispatchEvent(new Event("popstate"));
};

export const createRouter = () => {
  // rely on native event for subscription
  const subscribe = (h: () => void) => {
    window.addEventListener("popstate", h);
    return () => window.addEventListener("popstate", h);
  };

  // intercept click event on anchor element
  // prevent default and call navigate instead
  document.addEventListener("click", (event) => {
    const anchorEl = (event.target as HTMLElement | null)?.closest("a");

    if (
      anchorEl &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey &&
      event.button === 0 &&
      !event.defaultPrevented &&
      !(anchorEl.target === "_blank") &&
      isInternalUrl(anchorEl.href)
    ) {
      event.preventDefault();
      const { pathname } = new URL(anchorEl.href, window.location.href);
      navigate(pathname, {
        replace: !!anchorEl.hasAttribute("data-replace"),
        orBack: !!anchorEl.hasAttribute("data-or-back"),
      });
    }
  });

  const getUrl = () => window.location.pathname;

  return { subscribe, navigate, getUrl };
};

export type Router = ReturnType<typeof createRouter>;

const isInternalUrl = (href: string) => {
  const u = new URL(href, window.location.href);
  return u.origin === window.location.origin;
};
