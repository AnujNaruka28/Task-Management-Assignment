import { ChevronRightIcon, MoreHorizontal } from "lucide-react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

function Breadcrumb({
  ...props
}) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({
  className,
  ...props
}) {
  return (
    <ol
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-muted-foreground text-sm sm:gap-2.5",
        className
      )}
      data-slot="breadcrumb-list"
      {...props} />
  );
}

function BreadcrumbItem({
  className,
  ...props
}) {
  return (
    <li
      className={cn("inline-flex items-center gap-1.5", className)}
      data-slot="breadcrumb-item"
      {...props} />
  );
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "a";

  return (
    <Comp
      className={cn("transition-colors hover:text-[#fff]", className)}
      data-slot="breadcrumb-link"
      {...props} />
  );
}

function BreadcrumbPage({
  className,
  ...props
}) {
  return (
    // biome-ignore lint(a11y/useFocusableInteractive): known
    <span
      aria-current="page"
      aria-disabled="true"
      className={cn("font-normal text-[#fff]", className)}
      data-slot="breadcrumb-page"
      role="link"
      {...props} />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}) {
  return (
    <li
      aria-hidden="true"
      className={className}
      data-slot="breadcrumb-separator"
      role="presentation"
      {...props}>
      {children ?? <ChevronRightIcon size={16} />}
    </li>
  );
}

function BreadcrumbEllipsis({
  className,
  ...props
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("flex size-5 items-center justify-center", className)}
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      {...props}>
      <MoreHorizontal size={16} />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
