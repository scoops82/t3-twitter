import { useState } from "react";
import { api } from "../utils/api";
import { object, string } from "zod";

export const tweetSchema = object({
  text: string({
    required_error: "Tweet text is required",
  })
    .min(10)
    .max(280),
});

export function CreateTweet() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const utils = api.useContext();

  const { mutateAsync } = api.tweet.create.useMutation({
    onSuccess: () => {
      setText("");
      utils.tweet.timeline.invalidate();
    },
  });

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await tweetSchema.parse({ text });
    } catch (e) {
      setError(e.message);
      return;
    }

    if (text.length < 10) {
      setError("Tweet must be at least 10 characters long.");
      return;
    }

    mutateAsync({ text });
  }

  return (
    <>
      {error && JSON.stringify(error)}
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit}
        className="mb-4 flex w-full flex-col rounded-md border-2 p-4 "
      >
        <textarea
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 px-4 py-2 shadow "
        />

        <div className="mt-4 flex justify-end">
          <button
            className="rounded-md bg-primary px-4 py-2 text-white "
            type="submit"
          >
            Tweet
          </button>
        </div>
      </form>
    </>
  );
}
