import githubLogoUrl from "./github-mark-white.svg";
import infoUrl from "./info.svg";
import avatarUrl from "./avatar.svg";
import s from "./Header.module.css";

export const Header = () => (
  <header className={s.container}>
    <a
      className={s.link}
      href="https://github.com/Platane/timezone-rocks"
      title="github repository"
    >
      <img className={s.icon} src={githubLogoUrl} alt="github logo" />
    </a>

    <a className={s.link} href="/about" title="about">
      <img className={s.icon} src={infoUrl} alt="info icon" />
    </a>

    <a className={s.link} href="/avatar" title="avatar animation">
      <img className={s.icon} src={avatarUrl} alt="avatar icon" />
    </a>
  </header>
);
