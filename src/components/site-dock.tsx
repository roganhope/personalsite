import { Dock, DockIcon } from "./dock";
import { GitHubIcon, HomeIcon, LinkedInIcon, MailIcon } from "./icons";

export default function SiteDock() {
  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <Dock>
        <DockIcon href="/#top" ariaLabel="Home">
          <HomeIcon className="h-full w-full" />
        </DockIcon>
        <DockIcon href="https://github.com/roganhope" target="_blank" rel="noreferrer" ariaLabel="GitHub">
          <GitHubIcon className="h-full w-full" />
        </DockIcon>
        <DockIcon
          href="https://www.linkedin.com/in/hoperogan/"
          target="_blank"
          rel="noreferrer"
          ariaLabel="LinkedIn"
        >
          <LinkedInIcon className="h-full w-full" />
        </DockIcon>
        <DockIcon href="/#contact" ariaLabel="Email — jump to contact">
          <MailIcon className="h-full w-full" />
        </DockIcon>
      </Dock>
    </div>
  );
}
