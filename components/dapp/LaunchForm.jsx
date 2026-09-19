"use client";

import { useState } from "react";

const field =
  "w-full rounded-sharp border border-rule bg-sunken px-4 py-3 text-base text-paper transition-colors duration-150 outline-none placeholder:text-faint focus:border-rule-strong";

export default function LaunchForm() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [oneToOne, setOneToOne] = useState(false);

  /**
   * Reads the picked file into a data URL so it can be previewed. There is nowhere to
   * send it yet — the real upload goes to token metadata once the factory exists.
   *
   * Rendered through <img>, which never executes script inside an SVG, so an uploaded
   * vector cannot run anything here.
   */
  function chooseImage(event) {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);

    if (!file) {
      setImagePreview("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <form className="space-y-8" onSubmit={(event) => event.preventDefault()}>

      <div className="rounded-sharp border border-rule bg-panel">
        <div className="space-y-6 p-6">
          <div>
            <label className="label mb-2 block" htmlFor="token-name">
              Token name
            </label>
            <input
              id="token-name"
              className={field}
              placeholder="Nova Drift"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div>
            <label className="label mb-2 block" htmlFor="token-symbol">
              Symbol
            </label>
            <input
              id="token-symbol"
              className={field}
              placeholder="NDX"
              maxLength={10}
              value={symbol}
              onChange={(event) => setSymbol(event.target.value.toUpperCase())}
            />
          </div>

          <div>
            <label className="label mb-2 block" htmlFor="token-description">
              Description
            </label>
            <textarea
              id="token-description"
              className={`${field} min-h-24 resize-y`}
              placeholder="One line your buyers will actually read."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div>
            <span className="label mb-2 block">Image</span>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-lg border border-rule object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-rule-strong text-faint"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-6 w-6"
                  >
                    <rect x="3.2" y="4.6" width="17.6" height="14.8" rx="3.2" />
                    <circle cx="8.6" cy="9.6" r="1.7" />
                    <path
                      d="M4 17.4l4.8-4.4 3.6 3.3 3.1-2.7 4.5 4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}

              <label
                htmlFor="token-image"
                className="cursor-pointer rounded-full border border-rule-strong px-5 py-2.5 text-base font-semibold text-paper transition-colors duration-150 hover:border-gold hover:bg-gold-dim hover:text-gold"
              >
                {imageFile ? "Change image" : "Choose an image"}
              </label>

              <input
                id="token-image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={chooseImage}
              />

              {imageFile ? (
                <span className="font-mono text-sm text-faint">{imageFile.name}</span>
              ) : null}
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3.5 border-t border-rule pt-6">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#9d5cff]"
              checked={oneToOne}
              onChange={(event) => setOneToOne(event.target.checked)}
            />
            <span>
              <span className="block text-base font-semibold tracking-tight">
                Allow 1:1 trading before graduation
              </span>
              <span className="mt-1.5 block max-w-[52ch] text-base leading-[1.7] text-quiet">
                Lets this token swap unit for unit against other opted-in tokens while
                it is still on the curve. It cannot be enabled after launch.
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button
          type="submit"
          disabled
          className="cursor-not-allowed rounded-sharp border border-rule bg-transparent px-6 py-3 text-base font-semibold text-faint"
        >
          Launch token
        </button>
      </div>
    </form>
  );
}
