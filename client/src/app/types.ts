import type { ReactNode } from "react";

export type AppLayoutProps = {
  children: ReactNode;
};

export type SlugPageProps = {
  params: Promise<{ slug: string }>;
};

export type SlugArrayPageProps = {
  params: Promise<{ slug: string[] }>;
};

export type CategorySlugPageProps = {
  params: Promise<{ categorySlug: string }>;
};

export type KeyPageProps = {
  params: Promise<{ key: string }>;
};

export type CategoryKeyPageProps = {
  params: Promise<{ categoryKey: string }>;
};

export type TagIdPageProps = {
  params: Promise<{ key: string; tagId: string }>;
};
