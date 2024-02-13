import { Forma } from "forma-embedded-view-sdk/auto";
import { DateTime } from "luxon";

type PreviewButtonProps = {
  originalDate: Date,
  month: number;
  day: number;
  startHour: number;
  startMinute: number;
};

export default function PreviewButton(props: PreviewButtonProps) {
  const { originalDate, month, day, startHour, startMinute } = props;

  const onClickPreview = async () => {
    try {
      const projectTimezone = await Forma.project.getTimezone();
      if (!projectTimezone) {
        throw new Error("Unable to access project timezone");
      }
      const year = originalDate.getFullYear();

      let target = DateTime.fromObject(
        {
          year,
          month,
          day,
          hour: startHour,
          minute: startMinute,
        },
        { zone: projectTimezone },
      );

      await Forma.sun.setDate({ date: target.toJSDate() });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div class="row">
      <weave-button variant="outlined" onClick={onClickPreview}>
        Preview
      </weave-button>
    </div>
  );
}
