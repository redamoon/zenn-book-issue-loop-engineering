"use client";

type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      type="search"
      aria-label="キーワード検索"
      placeholder="キーワードで検索"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
