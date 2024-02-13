import _ from "lodash";

const formatTime = (x: number) => (x < 10 ? "0" + x : x).toString();

type TimeSelectorProps = {
  startHour: number;
  setStartHour: (startHour: number) => void;
  startMinute: number;
  setStartMinute: (startMinute: number) => void;
};

export default function TimeSelector(props: TimeSelectorProps) {
  const {
    startHour,
    setStartHour,
    startMinute,
    setStartMinute,
  } = props;

  return (
    <>
      <div class="row">
        <div class="row-title">Time</div>
        <div class="row-item">
          <weave-select
            value={startHour}
            onChange={(event) => setStartHour(parseInt((event as CustomEvent).detail.value, 10))}
            style={{ width: "70px", marginLeft: "4px" }}
          >
            {_.range(25).map((value) => (
              <weave-select-option value={value}>{formatTime(value)}</weave-select-option>
            ))}
          </weave-select>
          <weave-select
            value={startMinute}
            onChange={(event) => setStartMinute(parseInt((event as CustomEvent).detail.value, 10))}
            style={{ width: "70px", marginLeft: "5px" }}
          >
            {_.range(60).map((value) => (
              <weave-select-option value={value}>{formatTime(value)}</weave-select-option>
            ))}
          </weave-select>
        </div>
      </div>
    </>
  );
}
