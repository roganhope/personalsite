import { GitHubIcon, LinkedInIcon } from "./icons";
import Wrap from "./wrap";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t-[3px] border-pink bg-ink py-7.5 text-white">
      <Wrap className="flex items-center justify-end gap-4.5 text-[.8rem] max-[700px]:flex-col">
        <div className="flex gap-4.5 font-bold">
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.75 hover:text-pink"
          >
            <LinkedInIcon />
            LinkedIn ↗
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.75 hover:text-pink"
          >
            <GitHubIcon />
            GitHub ↗
          </a>
        </div>
      </Wrap>
    </footer>
  );
}
