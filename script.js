(function () {
  const data = typeof client !== "undefined" ? client : {};

  const $ = (id) => document.getElementById(id);

  function setText(id, value) {
    const el = $(id);
    if (el) el.textContent = value || "";
  }

  function initialsFromName(name) {
    return (name || "C")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("");
  }

  function telHref(phone) {
    return "tel:" + String(phone || "").replace(/[^\d+]/g, "");
  }

  function showToast(message) {
    const toast = $("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function hideIfEmpty(el, value) {
    if (!el) return;
    if (!value) el.classList.add("hidden");
    else el.classList.remove("hidden");
  }

  const socialIcons = {
    whatsapp:
      '<svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.2-.7.9-.8 1-.2.2-.3.2-.6.1-1.6-.8-2.7-1.9-3.5-3.4-.1-.2 0-.4.1-.5l.5-.6c.1-.2.2-.3.1-.5-.1-.2-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.2.7 3 .6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3C8.7 21.5 10.3 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.1 8.1 0 0 1 3.8 12 8.2 8.2 0 1 1 12 3.8 8.2 8.2 0 0 1 20.2 12 8.2 8.2 0 0 1 12 20.2z"/></svg>',
    instagram:
      '<svg viewBox="0 0 24 24"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm11 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>',
    facebook:
      '<svg viewBox="0 0 24 24"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z"/></svg>',
    linkedin:
      '<svg viewBox="0 0 24 24"><path d="M6.5 9H3.7v12h2.8V9zM5.1 3.5A1.7 1.7 0 1 0 5.1 7a1.7 1.7 0 0 0 0-3.5zM20.3 13.3c0-2.8-1.5-4.1-3.5-4.1-1.6 0-2.3.9-2.7 1.5V9.1h-2.8c0 .7 0 12 0 12h2.8v-6.7c0-.4 0-.7.1-1 .3-.7.9-1.4 2-1.4 1.4 0 2 1.1 2 2.7V21h2.8v-7.7z"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M18.2 3H21l-6.5 7.4L22 21h-6.2l-4.9-6.4L5.5 21H2.7l7-7.9L2 3h6.3l4.4 5.8L18.2 3zm-1.1 16.2h1.7L7 4.7H5.2l11.9 14.5z"/></svg>',
    tiktok:
      '<svg viewBox="0 0 24 24"><path d="M16.5 3c.4 2.4 1.9 4.1 4.2 4.4v2.8c-1.5-.1-2.9-.6-4.1-1.5v6.5c0 3.4-2.5 5.8-5.9 5.8S4.8 18.6 4.8 15.2 7.4 9.4 10.7 9.4c.3 0 .7 0 1 .1v2.9c-.3-.1-.6-.2-1-.2-1.8 0-3.1 1.5-3.1 3.3s1.3 3.3 3.1 3.3 3-1.5 3-3.3V3h2.8z"/></svg>',
    youtube:
      '<svg viewBox="0 0 24 24"><path d="M23 12.1c0-2.2-.2-3.7-.4-4.5-.3-1-1.1-1.8-2.1-2.1C18.8 5 12 5 12 5s-6.8 0-8.5.5c-1 .3-1.8 1.1-2.1 2.1C1.2 8.4 1 9.9 1 12.1s.2 3.7.4 4.5c.3 1 1.1 1.8 2.1 2.1C5.2 19.2 12 19.2 12 19.2s6.8 0 8.5-.5c1-.3 1.8-1.1 2.1-2.1.2-.8.4-2.3.4-4.5zM10 15.5v-7l6 3.5-6 3.5z"/></svg>',
  };

  function renderAvatar() {
    const img = $("avatar");
    if (!img) return;

    if (data.avatar) {
      img.src = data.avatar;
      img.alt = data.fullName || "Profile photo";
      img.onerror = () => {
        img.removeAttribute("src");
        img.classList.add("initials");
        img.alt = "";
        img.textContent = initialsFromName(data.fullName);
      };
      return;
    }

    img.removeAttribute("src");
    img.classList.add("initials");
    img.alt = "";
    img.textContent = initialsFromName(data.fullName);
  }

  function renderSocials() {
    const list = $("socialList");
    if (!list) return;

    const items = (data.socials || []).filter((item) => item.url);
    list.innerHTML = "";

    if (!items.length) {
      list.closest(".socials")?.classList.add("hidden");
      return;
    }

    items.forEach((item) => {
      const a = document.createElement("a");
      a.className = "social-link";
      a.href = item.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", item.name);
      a.innerHTML = (socialIcons[item.icon] || "") + `<span>${item.name}</span>`;
      list.appendChild(a);
    });
  }

  function buildVCard() {
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${data.fullName || ""}`,
      `N:${(data.fullName || "").split(" ").slice(-1)[0] || ""};${(data.fullName || "").split(" ")[0] || ""};;;`,
    ];

    if (data.jobTitle) lines.push(`TITLE:${data.jobTitle}`);
    if (data.company) lines.push(`ORG:${data.company}`);
    if (data.phone) lines.push(`TEL;TYPE=CELL:${data.phone}`);
    if (data.email) lines.push(`EMAIL;TYPE=INTERNET:${data.email}`);
    if (data.website) lines.push(`URL:${data.website}`);
    if (data.address) lines.push(`ADR;TYPE=WORK:;;${data.address};;;;`);
    if (data.bio) lines.push(`NOTE:${data.bio.replace(/\n/g, "\\n")}`);

    lines.push("END:VCARD");
    return lines.join("\r\n");
  }

  function saveContact() {
    const vcard = buildVCard();
    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const fileName = `${(data.fullName || "contact").replace(/\s+/g, "_")}.vcf`;

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    showToast("Contact saved — check your downloads");
  }

  function init() {
    document.title = data.fullName ? `${data.fullName} · Digital Card` : "Digital Card";

    setText("brandMark", data.brandMark || "NFC Card");
    setText("productName", data.productName || "TapCard");
    setText("fullName", data.fullName);
    setText("jobTitle", data.jobTitle);
    setText("company", data.company);
    setText("bio", data.bio);

    renderAvatar();

    const callBtn = $("callBtn");
    const phoneLink = $("phoneLink");
    const emailLink = $("emailLink");
    const websiteLink = $("websiteLink");
    const addressBlock = $("addressBlock");

    if (data.phone) {
      const href = telHref(data.phone);
      if (callBtn) callBtn.href = href;
      if (phoneLink) phoneLink.href = href;
      setText("phoneText", data.phone);
    } else {
      hideIfEmpty(callBtn, "");
      hideIfEmpty(phoneLink, "");
    }

    if (data.email) {
      if (emailLink) emailLink.href = `mailto:${data.email}`;
      setText("emailText", data.email);
    } else {
      hideIfEmpty(emailLink, "");
    }

    if (data.website) {
      if (websiteLink) websiteLink.href = data.website;
      setText("websiteText", data.website.replace(/^https?:\/\//, ""));
    } else {
      hideIfEmpty(websiteLink, "");
    }

    if (data.address) {
      setText("addressText", data.address);
    } else {
      hideIfEmpty(addressBlock, "");
    }

    renderSocials();

    $("saveBtn")?.addEventListener("click", saveContact);
  }

  init();
})();
