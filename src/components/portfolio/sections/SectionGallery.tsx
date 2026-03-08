interface Props {
  items: any[];
}

const SectionGallery = ({ items }: Props) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
    {items.map((img) => (
      <div
        key={img.id}
        className="group relative overflow-hidden aspect-square"
        style={{ borderRadius: "var(--portfolio-radius)" }}
      >
        <img
          src={img.image_url}
          alt={img.caption || ""}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        {img.caption && (
          <div
            className="absolute inset-x-0 bottom-0 p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: "linear-gradient(transparent, hsl(var(--portfolio-bg) / 0.85))",
              color: "hsl(var(--portfolio-fg))",
            }}
          >
            {img.caption}
          </div>
        )}
      </div>
    ))}
  </div>
);

export default SectionGallery;
