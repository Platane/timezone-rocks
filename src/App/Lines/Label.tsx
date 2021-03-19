import { styled } from "@linaria/react";
import { getFlagEmoji } from "../../emojiFlagSequence";
import { formatTime } from "../../intl-utils";
import { AWAKE_HOURS, OFFICE_HOURS } from "./interval";

type Props = {
  hour: number;
  countryCode: string;
  style?: any;
  className?: any;
};

export const Label = ({ hour, countryCode, style, className }: Props) => {
  const activity =
    (hour < AWAKE_HOURS[0] && "😴") ||
    (hour < OFFICE_HOURS[0] && `☕️`) ||
    (hour < OFFICE_HOURS[1] && `👨‍💻`) ||
    (hour < AWAKE_HOURS[1] && "🍻") ||
    "😴";

  return (
    <Container style={style} className={className}>
      <Avatar>{activity}</Avatar>
      <Flag>{getFlagEmoji(countryCode)}</Flag>
      {formatTime(hour)}
    </Container>
  );
};

const Avatar = styled.div`
  width: 26px;
  font-size: 20px;
  margin-right: 4px;
`;

const Flag = styled.div`
  font-size: 12px;
  position: absolute;
  left: 16px;
  top: 14px;
`;

const Container = styled.div`
  white-space: nowrap;
  position: absolute;
  font-family: monospace;
  font-size: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
