import { CloseDialogButton, DialogModal } from "../Dialog/Dialog";
import s from "./InfoDialog.module.css";

export const InfoDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) => (
  <DialogModal
    className={s.infoDialogModal}
    open={open}
    onClose={() => onOpenChange(false)}
  >
    <CloseDialogButton />
    <h1>Usage</h1>
    Timezone.rocks allows to visualize different timezones all around the globe.
    <br />
    <br />
    It can be helpful to plan meeting where everyone is awake.
    <h1>Attribution</h1>
    <ul>
      <li>
        The earth model is a slightly modified version of this{" "}
        <a href="https://sketchfab.com/3d-models/earth-0caafb7e837047a688a3e504c0ea74af">
          model
        </a>{" "}
        by <a href="https://sketchfab.com/karinkreeft8">BamPistache</a>
        <span className="license">
          (
          <a href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC</a>
          )
        </span>
      </li>
      <li>
        Locations names and positions are pulled from{" "}
        <a href="http://www.geonames.org/">geonames.org</a>
        <span className="license">
          (<a href="https://creativecommons.org/licenses/by/4.0/">CC BY</a>)
        </span>
      </li>
    </ul>
    <br />
    <br />
    For more information, bug report and congratulations, check out the
    repository at{" "}
    <a href="https://github.com/Platane/timezone-rocks">
      github.com/Platane/timezone-rocks
    </a>
  </DialogModal>
);
