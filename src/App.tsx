import MastroGPT from "./components/MastroGPT";
import { Service } from "./types";
import { fetcher } from "./utils";
import clsx from "clsx";
import React from "react";
import useSWR from "swr";

let BASEURL = "";
if (typeof window !== "undefined") {
  BASEURL = window.location.protocol + "//" + window.location.host + "/";
}

function App() {
  let services: Service[] = [];

  const { data, error, isLoading } = useSWR(
    BASEURL + "api/my/mastrogpt/index",
    fetcher
  );

  if (!isLoading && !error) {
    services = data.services;
  }

  const [selectedService, setSelectedService] = React.useState<string>("");

  return (
    <main className="bg-zinc-800 flex flex-col">
      <>
        <section id="nav">
          <nav className="p-4 flex gap-4 items-center border-b border-zinc-500">
            <div>
              <button type="button" onClick={() => setSelectedService("")}>
                <img
                  src="/nuv-white.svg"
                  className=""
                  width="150"
                  height="41"
                  alt="MastroGPT logo"
                />
              </button>
            </div>
            <div className="ml-auto flex gap-4">
              {services.map((service: Service, index: number) => (
                <button
                  type="button"
                  onClick={() => setSelectedService(service.url)}
                  key={index}
                  className={clsx(
                    "py-2 px-4 text-white rounded-md",
                    service.url === selectedService
                      ? "bg-purple-700"
                      : "bg-zinc-500 hover:bg-zinc-600"
                  )}
                >
                  {service.name}
                </button>
              ))}
            </div>
          </nav>
        </section>
        <section
          id="content"
          className="md:grid grid-cols-2 divide-x-2 divide-purple-500"
        >
          <MastroGPT service={selectedService} />;
        </section>
      </>
    </main>
  );
}

export default App;
