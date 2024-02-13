import { useEffect , useState} from "preact/hooks";
import { Forma } from "forma-embedded-view-sdk/auto";
import DateSelector from "./DateSelector";
import TimeSelector from "./TimeSelector";
import PreviewButton from "./PreviewButton";
import ResetButton from "./ResetButton";

export default function Sidebar() {
  const [month, setMonth] = useState(6);
  const [day, setDay] = useState(15);
  const [startHour, setStartHour] = useState(8);
  const [startMinute, setStartMinute] = useState(0);

  const [originalDate, setOriginalDate] = useState<Date>();

  const getOriginalDate = async () => {
    try {
      const od = await Forma.sun.getDate();
      setOriginalDate(od);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getOriginalDate()
  }, []);


  if (!originalDate) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Shadow study</h1>
      <DateSelector month={month} setMonth={setMonth} day={day} setDay={setDay} />
      <TimeSelector
        startHour={startHour}
        setStartHour={setStartHour}
        startMinute={startMinute}
        setStartMinute={setStartMinute}
      />

      <div class="row">
        <PreviewButton
          originalDate={originalDate}
          month={month}
          day={day}
          startHour={startHour}
          startMinute={startMinute}
        />

        <ResetButton originalDate={originalDate} />
      </div>
    </>
  );
}

