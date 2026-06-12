import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { UtkastElement } from "./UtkastTypes";

const logEvent = vi.fn();
vi.mock("@src/utils/analytics", () => ({
  logEvent: (...args: unknown[]) => logEvent(...args),
}));

import UtkastLinkCard from "./UtkastLinkCard";

const baseUtkast: UtkastElement = {
  tittel: "Søknad om dagpenger",
  link: "https://nav.no/utkast/1",
  utkastId: "1",
  opprettet: "2024-03-15T10:00:00.000Z",
  sistEndret: "2024-03-16T10:00:00.000Z",
  slettesEtter: null,
};

describe("UtkastLinkCard", () => {
  afterEach(() => {
    logEvent.mockReset();
  });

  it("should render the title as a link to the draft", () => {
    render(<UtkastLinkCard utkast={baseUtkast} language="nb" />);

    const link = screen.getByRole("link", { name: "Søknad om dagpenger" });
    expect(link).toHaveAttribute("href", "https://nav.no/utkast/1");
  });

  it("should render the created date formatted as DD.MM.YYYY", () => {
    render(<UtkastLinkCard utkast={baseUtkast} language="nb" />);

    expect(
      screen.getByText(/Du startet på utkastet 15\.03\.2024/),
    ).toBeInTheDocument();
  });

  it("should render the created text in english when language is en", () => {
    render(<UtkastLinkCard utkast={baseUtkast} language="en" />);

    expect(
      screen.getByText(/You started the draft 15\.03\.2024/),
    ).toBeInTheDocument();
  });

  it("should not render a deletion tag when slettesEtter is null", () => {
    render(<UtkastLinkCard utkast={baseUtkast} language="nb" />);

    expect(screen.queryByText(/Utkastet slettes/)).not.toBeInTheDocument();
  });

  it("should render a deletion tag when slettesEtter is set", () => {
    render(
      <UtkastLinkCard
        utkast={{ ...baseUtkast, slettesEtter: "2024-06-01T10:00:00.000Z" }}
        language="nb"
      />,
    );

    expect(
      screen.getByText(/Utkastet slettes 01\.06\.2024/),
    ).toBeInTheDocument();
  });

  it("should log an analytics event when the card is clicked", () => {
    render(<UtkastLinkCard utkast={baseUtkast} language="nb" />);

    fireEvent.click(screen.getByRole("link", { name: "Søknad om dagpenger" }));

    expect(logEvent).toHaveBeenCalledWith("utkast-åpnet");
  });
});
