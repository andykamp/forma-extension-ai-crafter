import { Forma } from "forma-embedded-view-sdk/auto";

type ResetButtonProps = {
  originalDate: Date;
};

export default function ResetButton(props: ResetButtonProps) {
  const {originalDate} = props;

  const onClickPreview = async () => {
    try {
      await Forma.sun.setDate({ date: originalDate });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div class="row">
      <weave-button variant="outlined" onClick={onClickPreview}>
        Reset
      </weave-button>
    </div>
  );
}
