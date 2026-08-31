interface ScreenHeaderProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
}

export const ScreenHeader = ({ eyebrow, title, description }: ScreenHeaderProps) => (
  <header className="screen-header">
    <span className="eyebrow">{eyebrow}</span>
    <h1>{title}</h1>
    <p>{description}</p>
  </header>
);
