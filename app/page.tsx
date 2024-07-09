import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import HomePage from "./_components/HomePage";

export default function Home() {
  return (
    <section className="flex flex-col  justify-center gap-4  md:border ">
      <HomePage/>
    </section>
  );
}
