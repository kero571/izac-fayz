"use client";
import { defaultContent, SECTION_LABELS } from "@/content/defaults";
import { FONTS } from "@/lib/fonts";
import { ICON_NAMES, SOCIAL_PLATFORMS } from "@/components/ui/Icon";
import { useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import { posterUrl } from "@/lib/media";
import {
  BulkUpload,
  Btn,
  Field,
  Card,
  Color,
  ListEditor,
  Media,
  Select,
  Text,
  TextList,
  Toggle,
  uid,
  useAdmin,
} from "./fields";

const TitleFields = ({ p }) => (
  <div className="grid gap-4 md:grid-cols-2">
    <Text path={`${p}.titleStart`} label="Title (white part)" />
    <Text path={`${p}.titleAccent`} label="Title (colored part)" />
  </div>
);

function General() {
  return (
    <>
      <Card
        title="Site identity"
        hint="Used in the header, footer, browser tab and Google results."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Text path="site.name" label="Name (header)" />
          <Text path="site.studio" label="Studio name (footer)" />
          <Text path="site.jobTitle" label="Job title" />
          <Text
            path="site.location"
            label="Location"
            hint='Format "City, Country" (used for local SEO)'
          />
        </div>
        <Text path="site.title" label="SEO title (Google tab title)" />
        <Text
          path="site.description"
          label="SEO description"
          area
          hint="150–160 characters is ideal."
        />
        <TextList path="site.keywords" label="SEO keywords" />
      </Card>
      <Card
        title="Menu & footer links"
        hint="Use #work, #services, #about, #contact… or any full link. Links to hidden sections are removed automatically."
      >
        <ListEditor
          path="nav"
          title={(i) => i.label}
          addLabel="Add link"
          newItem={() => ({ label: "New link", href: "#" })}
          render={(_, p) => (
            <div className="grid gap-4 md:grid-cols-2">
              <Text path={`${p}.label`} label="Label" />
              <Text path={`${p}.href`} label="Link" />
            </div>
          )}
        />
      </Card>
      <Card title="Footer">
        <Text path="footer.tagline" label="Tagline" area />
        <Text path="footer.backToTop" label="Back to top label" />
      </Card>
    </>
  );
}

function Theme() {
  const { set, get } = useAdmin();
  const font = get("theme.font");
  return (
    <>
      <Card
        title="Colors"
        hint="Changes apply to the whole site after you press Save."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Color path="theme.accent" label="Accent (buttons, highlights)" />
          <Color path="theme.bg" label="Main background" />
          <Color path="theme.bgAlt" label="Alternate section background" />
          <Color path="theme.card" label="Cards" />
          <Color path="theme.border" label="Borders" />
          <Color path="theme.text" label="Main text" />
          <Color path="theme.muted" label="Secondary text" />
        </div>
        <div>
          <Btn onClick={() => set("theme", { ...defaultContent.theme })}>
            Reset colors & font to default
          </Btn>
        </div>
      </Card>
      <Card
        title="Font"
        hint="Pick a ready font, upload your own font file, or use any Google Font by name. “System” is the fastest because nothing is downloaded."
      >
        <Select
          path="theme.font"
          label="Site font"
          options={[
            ...Object.entries(FONTS).map(([k, f]) => [k, f.label]),
            ["custom", "★ My own font (upload file)"],
            ["google", "★ Google Fonts (type a name)"],
          ]}
        />
        {font === "custom" && (
          <>
            <Text
              path="theme.customFont.family"
              label="Font name"
              hint="Letters, numbers and spaces only, e.g. My Brand Sans"
            />
            <Media
              path="theme.customFont.regular"
              kind="raw"
              folder="fonts"
              accept=".woff2,.woff,.ttf,.otf"
              label="Regular font file"
              hint=".woff2 is best (smallest). Variable fonts cover all weights with one file."
            />
            <Media
              path="theme.customFont.bold"
              kind="raw"
              folder="fonts"
              accept=".woff2,.woff,.ttf,.otf"
              label="Bold font file (optional)"
              hint="Only needed if your font is not variable. Headings use it."
            />
          </>
        )}
        {font === "google" && (
          <div className="grid gap-4 md:grid-cols-2">
            <Text
              path="theme.googleFont"
              label="Google Font name"
              hint="Exactly as on fonts.google.com, e.g. Poppins or Playfair Display"
            />
            <Text
              path="theme.googleWeights"
              label="Weights"
              hint='Separated by ";" e.g. 400;600;700. Use only weights the font has.'
            />
          </div>
        )}
      </Card>
    </>
  );
}

function Sections() {
  const { c, set } = useAdmin();
  const { order, hidden } = c.sections;
  const move = (i, d) => {
    const a = [...order];
    const j = i + d;
    if (j < 0 || j >= a.length) return;
    [a[i], a[j]] = [a[j], a[i]];
    set("sections.order", a);
  };
  const toggle = (id) =>
    set(
      "sections.hidden",
      hidden.includes(id) ? hidden.filter((x) => x !== id) : [...hidden, id],
    );
  return (
    <Card
      title="Sections"
      hint="Show/hide each section and change their order. Section numbers update automatically. The hero is always on top."
    >
      <ul className="space-y-2">
        {order.map((id, i) => (
          <li
            key={id}
            className="flex items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3"
          >
            <span className="font-semibold text-ink">{SECTION_LABELS[id]}</span>
            <span className="flex items-center gap-2">
              <Btn onClick={() => move(i, -1)} className="!px-3 !py-1.5">
                ↑
              </Btn>
              <Btn onClick={() => move(i, 1)} className="!px-3 !py-1.5">
                ↓
              </Btn>
              <Btn
                variant={hidden.includes(id) ? "ghost" : "primary"}
                onClick={() => toggle(id)}
                className="w-20 !py-1.5"
              >
                {hidden.includes(id) ? "Hidden" : "Visible"}
              </Btn>
            </span>
          </li>
        ))}
      </ul>
      <Toggle
        path="hero.showBrands"
        label="Show the brands strip inside the hero"
      />
    </Card>
  );
}

function Hero() {
  return (
    <>
      <Card title="Hero text">
        <Text path="hero.badge" label="Badge above the title" />
        <TitleFields p="hero" />
        <div className="grid gap-4 md:grid-cols-2">
          <Text path="hero.primary.label" label="Main button text" />
          <Text path="hero.primary.href" label="Main button link" />
          <Text path="hero.secondary.label" label="Second button text" />
          <Text path="hero.secondary.href" label="Second button link" />
        </div>
      </Card>
      <Card title="Hero stats">
        <ListEditor
          path="hero.stats"
          title={(s) => `${s.value} ${s.label}`}
          addLabel="Add stat"
          newItem={() => ({ value: "10+", label: "Label" })}
          render={(_, p) => (
            <div className="grid gap-4 md:grid-cols-2">
              <Text path={`${p}.value`} label="Number" />
              <Text path={`${p}.label`} label="Label" />
            </div>
          )}
        />
      </Card>
      <Card title="Hero photo">
        <Media
          path="hero.image"
          label="Photo"
          folder="hero"
          hint="Portrait photo on a dark background works best."
        />
        <Text path="hero.imageAlt" label="Alt text (SEO / accessibility)" />
      </Card>
    </>
  );
}

function Brands() {
  const { queueDelete } = useAdmin();
  return (
    <Card
      title="Brands strip (logos)"
      hint="Upload each brand logo (PNG/SVG/WebP with transparent background looks best, ideally white or light logos). A brand without a logo shows its name as text."
    >
      <Text path="hero.brandsLabel" label="Strip label" />
      <ListEditor
        path="brands"
        title={(b) => b.name}
        addLabel="Add brand"
        newItem={() => ({ id: uid(), name: "Brand", logo: null })}
        onRemove={(b) =>
          b.logo?.provider === "cloudinary" && queueDelete(b.logo, "image")
        }
        extra={
          <BulkUpload
            path="brands"
            folder="brands"
            text="Upload several logos"
            make={(media, file) => ({
              id: uid(),
              name: file.name.replace(/\.[^.]+$/, ""),
              logo: media,
            })}
          />
        }
        render={(_, p) => (
          <>
            <Text path={`${p}.name`} label="Brand name (alt text)" />
            <Media path={`${p}.logo`} label="Logo" folder="brands" />
          </>
        )}
      />
    </Card>
  );
}

function About() {
  return (
    <>
      <Card title="About text">
        <TitleFields p="about" />
        <Text path="about.text" label="Paragraph" area />
        <div className="grid gap-4 md:grid-cols-2">
          <Text path="about.captionName" label="Photo caption: name" />
          <Text path="about.captionRole" label="Photo caption: role" />
        </div>
      </Card>
      <Card title="Photo">
        <Media path="about.image" label="Photo" folder="about" />
        <Text path="about.imageAlt" label="Alt text" />
      </Card>
      <Card title="Info cards">
        <ListEditor
          path="about.cards"
          title={(i) => i.title}
          addLabel="Add card"
          newItem={() => ({ icon: "star", title: "Title", text: "Text" })}
          render={(_, p) => (
            <>
              <Select path={`${p}.icon`} label="Icon" options={ICON_NAMES} />
              <Text path={`${p}.title`} label="Title" />
              <Text path={`${p}.text`} label="Text" area />
            </>
          )}
        />
      </Card>
    </>
  );
}

function Services() {
  return (
    <>
      <Card title="Services heading">
        <TitleFields p="services" />
        <Text path="services.subtitle" label="Subtitle" />
      </Card>
      <Card title="Service cards" hint="Numbers (01, 02…) are automatic.">
        <ListEditor
          path="services.items"
          title={(s) => s.title}
          addLabel="Add service"
          newItem={() => ({
            id: uid(),
            tag: "Tag",
            title: "New service",
            text: "Description",
            chips: [],
          })}
          render={(_, p) => (
            <>
              <Text path={`${p}.title`} label="Title" />
              <Text path={`${p}.tag`} label="Tag (top right)" />
              <Text path={`${p}.text`} label="Description" area />
              <TextList path={`${p}.chips`} label="Chips" />
            </>
          )}
        />
      </Card>
    </>
  );
}

const IMG_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;
const fileName = (m) =>
  m?.url ? decodeURIComponent(m.url.split("?")[0].split("/").pop()) : "";

/** One category = one panel: rename it, upload files into it, manage the files inside. */
function CategoryPanel({ name, index, uncategorized }) {
  const { c, get, set, getToken, queueDelete } = useAdmin();
  const [status, setStatus] = useState("");
  const [path, setPath] = useState("");
  const cats = c.work.categories;
  const items = c.work.items;
  const mine = items
    .map((it, gi) => ({ it, gi }))
    .filter(({ it }) =>
      uncategorized ? !cats.includes(it.category) : it.category === name,
    );

  const dropMedia = (it) => {
    if (it.media?.provider === "cloudinary")
      queueDelete(it.media, it.kind === "image" ? "image" : "video");
    if (it.poster?.provider === "cloudinary") queueDelete(it.poster, "image");
  };

  async function onFiles(e) {
    const files = [...(e.target.files || [])];
    e.target.value = "";
    let list = get("work.items") || [];
    for (const [i, file] of files.entries()) {
      const kind = file.type.startsWith("image/") ? "image" : "video";
      try {
        setStatus(`Uploading ${i + 1}/${files.length}… 0%`);
        const media = await uploadToCloudinary({
          file,
          resourceType: kind,
          folder: "works",
          token: await getToken(),
          onProgress: (p) =>
            setStatus(`Uploading ${i + 1}/${files.length}… ${p}%`),
        });
        list = [
          ...list,
          {
            id: uid(),
            visible: true,
            kind,
            category: uncategorized ? "" : name,
            title: "",
            media,
            poster: null,
          },
        ];
        set("work.items", list);
      } catch (x) {
        setStatus(`Failed: ${x.message}`);
        return;
      }
    }
    setStatus("");
  }

  function addPath() {
    const url = path.trim();
    if (!url) return;
    const kind = IMG_EXT.test(url) ? "image" : "video";
    set("work.items", [
      ...items,
      {
        id: uid(),
        visible: true,
        kind,
        category: uncategorized ? "" : name,
        title: "",
        media: { provider: "local", url },
        poster: null,
      },
    ]);
    setPath("");
  }

  const rename = (v) => {
    set(
      "work.categories",
      cats.map((x, i) => (i === index ? v : x)),
    );
    set(
      "work.items",
      items.map((it) => (it.category === name ? { ...it, category: v } : it)),
    );
  };
  const moveCat = (d) => {
    const j = index + d;
    if (j < 0 || j >= cats.length) return;
    const a = [...cats];
    [a[index], a[j]] = [a[j], a[index]];
    set("work.categories", a);
  };
  const deleteCat = () => {
    if (
      !confirm(
        `Delete the category "${name}"${mine.length ? ` and its ${mine.length} file(s)` : ""}?`,
      )
    )
      return;
    mine.forEach(({ it }) => dropMedia(it));
    set(
      "work.items",
      items.filter((it) => it.category !== name),
    );
    set(
      "work.categories",
      cats.filter((_, i) => i !== index),
    );
  };
  const moveFile = (gi, d) => {
    const pos = mine.findIndex((m) => m.gi === gi);
    const t = mine[pos + d];
    if (!t) return;
    const a = [...items];
    [a[gi], a[t.gi]] = [a[t.gi], a[gi]];
    set("work.items", a);
  };
  const removeFile = (gi) => {
    if (!confirm("Delete this file?")) return;
    dropMedia(items[gi]);
    set(
      "work.items",
      items.filter((_, i) => i !== gi),
    );
  };

  return (
    <details className="rounded-2xl border bg-card/60">
      <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-sm font-bold text-ink">
        <span className="truncate">
          {uncategorized ? "Without category" : name || "(no name)"}{" "}
          <span className="font-normal text-muted">
            · {mine.length} file{mine.length === 1 ? "" : "s"}
          </span>
        </span>
        {!uncategorized && (
          <span
            className="flex shrink-0 gap-1.5"
            onClick={(e) => e.preventDefault()}
          >
            <Btn
              onClick={() => moveCat(-1)}
              aria-label="Move up"
              className="!px-2.5 !py-1"
            >
              ↑
            </Btn>
            <Btn
              onClick={() => moveCat(1)}
              aria-label="Move down"
              className="!px-2.5 !py-1"
            >
              ↓
            </Btn>
            <Btn variant="danger" onClick={deleteCat} className="!px-2.5 !py-1">
              Delete
            </Btn>
          </span>
        )}
      </summary>

      <div className="grid gap-4 border-t p-4">
        {!uncategorized && (
          <Field label="Category name">
            <input
              className="w-full rounded-xl border bg-card px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
              value={name}
              onChange={(e) => rename(e.target.value)}
            />
          </Field>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <label className="cursor-pointer rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-on-accent">
            {status || "+ Upload files here"}
            <input
              type="file"
              multiple
              accept="video/*,image/*"
              className="sr-only"
              onChange={onFiles}
            />
          </label>
          <span className="text-xs text-muted">
            Videos or images, you can select many at once.
          </span>
        </div>
        <div className="flex gap-2">
          <input
            className="w-full rounded-xl border bg-card px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60"
            placeholder="…or add a file from the project, e.g. /works/reel-1.mp4"
            value={path}
            onChange={(e) => setPath(e.target.value)}
          />
          <Btn onClick={addPath}>Add</Btn>
        </div>

        {mine.length === 0 && (
          <p className="text-sm text-muted">No files in this category yet.</p>
        )}
        <div className="space-y-2.5">
          {mine.map(({ it, gi }, n) => {
            const thumb = posterUrl(it, 120);
            return (
              <details
                key={it.id || gi}
                className="rounded-xl border bg-base/60"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-sm text-ink">
                  <span className="flex min-w-0 items-center gap-3">
                    {thumb ? (
                      /* eslint-disable-next-line @next/next/no-img-element */ <img
                        src={thumb}
                        alt=""
                        className="h-10 w-7 rounded object-cover"
                      />
                    ) : (
                      <span className="grid h-10 w-7 place-items-center rounded bg-card text-xs text-muted">
                        {it.kind === "image" ? "IMG" : "▶"}
                      </span>
                    )}
                    <span className="truncate">
                      {n + 1}. {it.title || fileName(it.media) || "(empty)"}
                    </span>
                    {it.visible === false && (
                      <span className="rounded bg-line px-1.5 text-[10px] text-muted">
                        hidden
                      </span>
                    )}
                  </span>
                  <span
                    className="flex shrink-0 gap-1.5"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Btn
                      onClick={() => moveFile(gi, -1)}
                      aria-label="Move up"
                      className="!px-2 !py-1"
                    >
                      ↑
                    </Btn>
                    <Btn
                      onClick={() => moveFile(gi, 1)}
                      aria-label="Move down"
                      className="!px-2 !py-1"
                    >
                      ↓
                    </Btn>
                    <Btn
                      variant="danger"
                      onClick={() => removeFile(gi)}
                      className="!px-2 !py-1"
                    >
                      Delete
                    </Btn>
                  </span>
                </summary>
                <div className="grid gap-4 border-t p-3">
                  <Toggle
                    path={`work.items.${gi}.visible`}
                    label="Visible on the site"
                  />
                  <Text
                    path={`work.items.${gi}.title`}
                    label="Title (optional)"
                  />
                  <Media
                    path={`work.items.${gi}.media`}
                    label="File (replace it here)"
                    kind={it.kind === "image" ? "image" : "video"}
                    folder="works"
                  />
                  {it.kind !== "image" && (
                    <Media
                      path={`work.items.${gi}.poster`}
                      label="Cover image (optional)"
                      folder="posters"
                      hint="Cloudinary videos get an automatic cover. Upload one only for a custom cover, or for videos stored in the project."
                    />
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </details>
  );
}

function Work() {
  const { c, set } = useAdmin();
  const cats = c.work.categories;
  const hasUncat = c.work.items.some((i) => !cats.includes(i.category));
  return (
    <>
      <Card title="Work section">
        <TitleFields p="work" />
        <div className="grid gap-4 md:grid-cols-3">
          <Text path="work.allLabel" label="“All” filter label" />
          <Text path="work.showMoreLabel" label="Show more label" />
          <Text number path="work.pageSize" label="Cards per page" />
        </div>
        <Toggle
          path="work.autoShuffle"
          label="Auto-shuffle the order of the videos"
        />
        {c.work.autoShuffle && (
          <Text
            number
            path="work.shuffleHours"
            label="Change the order every (hours)"
            hint="Visitors see a different order every few hours, inside every category. The order you set below is used when this is off."
          />
        )}
      </Card>
      <Card
        title="Categories & files"
        hint="Open a category to upload its videos/images. The categories become the filter buttons on the site."
      >
        <div className="space-y-3">
          {cats.map((name, i) => (
            <CategoryPanel key={i} name={name} index={i} />
          ))}
          {hasUncat && <CategoryPanel uncategorized />}
        </div>
        <div>
          <Btn
            variant="primary"
            onClick={() =>
              set("work.categories", [
                ...cats,
                `New category ${cats.length + 1}`,
              ])
            }
          >
            + Add category
          </Btn>
        </div>
      </Card>
    </>
  );
}

function Experience() {
  return (
    <>
      <Card title="Experience heading">
        <TitleFields p="experience" />
      </Card>
      <Card title="Jobs">
        <ListEditor
          path="experience.items"
          title={(e) => `${e.role} — ${e.company}`}
          addLabel="Add job"
          newItem={() => ({
            id: uid(),
            date: "2025 - Present",
            role: "Role",
            company: "Company",
            mode: "Remote",
            text: "",
          })}
          render={(_, p) => (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Text path={`${p}.date`} label="Dates" />
                <Text path={`${p}.role`} label="Role" />
                <Text path={`${p}.company`} label="Company" />
                <Text path={`${p}.mode`} label="On-site / Remote" />
              </div>
              <Text path={`${p}.text`} label="Description" area />
            </>
          )}
        />
      </Card>
    </>
  );
}

function Reviews() {
  const { queueDelete } = useAdmin();
  return (
    <>
      <Card title="Testimonials heading">
        <TitleFields p="reviews" />
      </Card>
      <Card
        title="Chat screenshots"
        hint="Upload screenshots of client chats. The whole section hides itself while this list is empty."
      >
        <ListEditor
          path="reviews.items"
          title={(r) => r.alt || "Screenshot"}
          addLabel="Add screenshot"
          newItem={() => ({ id: uid(), image: null, alt: "" })}
          onRemove={(r) =>
            r.image?.provider === "cloudinary" && queueDelete(r.image, "image")
          }
          extra={
            <BulkUpload
              path="reviews.items"
              folder="reviews"
              text="Upload several screenshots"
              make={(media) => ({ id: uid(), image: media, alt: "" })}
            />
          }
          render={(_, p) => (
            <>
              <Media path={`${p}.image`} label="Screenshot" folder="reviews" />
              <Text
                path={`${p}.alt`}
                label="Short description (alt text)"
                placeholder="e.g. Client feedback on the Telecom Egypt campaign"
              />
            </>
          )}
        />
      </Card>
    </>
  );
}
function Contact() {
  return (
    <>
      <Card title="Contact heading">
        <TitleFields p="contact" />
        <Text path="contact.text" label="Paragraph" area />
      </Card>
      <Card title="Buttons">
        <div className="grid gap-4 md:grid-cols-2">
          <Text
            path="contact.whatsapp"
            label="WhatsApp number"
            hint="Digits with country code, e.g. 201028060129"
          />
          <Text path="contact.whatsappLabel" label="WhatsApp button text" />
          <Text
            path="contact.whatsappMessage"
            label="Pre-filled WhatsApp message"
          />
          <Text path="contact.email" label="Email" />
          <Text path="contact.emailLabel" label="Email button text" />
          <Text path="contact.cvLabel" label="CV button text" />
        </div>
        <Media path="contact.cv" kind="raw" label="CV (PDF)" folder="files" />
      </Card>
      <Card title="Social links">
        <ListEditor
          path="contact.socials"
          title={(s) => `${s.platform}: ${s.url}`}
          addLabel="Add link"
          newItem={() => ({ platform: "instagram", url: "https://" })}
          render={(_, p) => (
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                path={`${p}.platform`}
                label="Platform"
                options={SOCIAL_PLATFORMS}
              />
              <Text path={`${p}.url`} label="Link" />
            </div>
          )}
        />
      </Card>
    </>
  );
}

export const TABS = [
  { id: "general", label: "General & SEO", Comp: General },
  { id: "theme", label: "Colors & Font", Comp: Theme },
  { id: "sections", label: "Sections", Comp: Sections },
  { id: "hero", label: "Hero", Comp: Hero },
  { id: "brands", label: "Brands", Comp: Brands },
  { id: "about", label: "About", Comp: About },
  { id: "services", label: "Services", Comp: Services },
  { id: "work", label: "Work", Comp: Work },
  { id: "experience", label: "Experience", Comp: Experience },
  { id: "reviews", label: "Testimonials", Comp: Reviews },
  { id: "contact", label: "Contact", Comp: Contact },
];
