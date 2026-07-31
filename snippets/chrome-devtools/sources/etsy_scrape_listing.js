(() => {
    console.clear();

    const root =
        document.querySelector('[data-selector="listing-page-content"]') ||
        document.querySelector(".listing-page-content") ||
        document.body;

    const text = (selector) =>
        root.querySelector(selector)?.textContent.trim() || "";

    const attr = (selector, attribute) =>
        root.querySelector(selector)?.getAttribute(attribute) || "";

    // ------------------------------------------------------------
    // Basic
    // ------------------------------------------------------------

    const id =
        attr("[data-listing-id]", "data-listing-id") ||
        attr("[data-palette-listing-id]", "data-palette-listing-id") ||
        location.pathname.match(/listing\/(\d+)/)?.[1] ||
        "";

    const slug =
        location.pathname
            .split("/")
            .slice(3)
            .join("-");

    const title =
        text("#listing-page-title") ||
        text("h1");

    // ------------------------------------------------------------
    // Price
    // ------------------------------------------------------------

    const currency =
        text(".currency-symbol");

    const priceText =
        text(".currency-value");

    const price =
        parseFloat(priceText.replace(/,/g, "")) || null;

    const price_raw =
        `${currency} ${priceText}`.trim();

    // ------------------------------------------------------------
    // Shop
    // ------------------------------------------------------------

    const shop =
        text("[data-shop-name]") ||
        text("[data-seller-name-link]") ||
        text('a[href*="/shop/"]');

    const shop_url =
        root.querySelector('a[href*="/shop/"]')?.href || "";

    // ------------------------------------------------------------
    // Rating
    // ------------------------------------------------------------

    let rating = null;
    let max_rating = 5;

    const ratingLabel =
        root.querySelector('[aria-label*="out of"]')
            ?.getAttribute("aria-label") || "";

    if (ratingLabel) {
        rating =
            parseFloat(
                ratingLabel.match(/[\d.]+/)?.[0]
            ) || null;

        max_rating =
            parseInt(
                ratingLabel.match(/out of (\d+)/)?.[1] || 5
            );
    }

    // ------------------------------------------------------------
    // Reviews
    // ------------------------------------------------------------

    let reviews = null;

    const reviewLink =
        [...root.querySelectorAll('a[href="#reviews"]')]
            .find(a => /\d/.test(a.textContent));

    if (reviewLink) {
        reviews =
            parseInt(
                reviewLink.textContent
                    .match(/[\d,]+/)?.[0]
                    ?.replace(/,/g, "")
            ) || null;
    }

    // ------------------------------------------------------------
    // Favorites
    // ------------------------------------------------------------

    let favorites = null;

    const fav =
        root.querySelector("[data-favorite-count]");

    if (fav) {
        favorites =
            parseInt(
                fav.textContent
                    .match(/[\d,]+/)?.[0]
                    ?.replace(/,/g, "")
            ) || null;
    }

    // ------------------------------------------------------------
    // Description
    // ------------------------------------------------------------

    const description =
        text("[data-product-details-description-text-content]") ||
        text('[data-id="description-text"]') ||
        text("#description-text");

    const description_length =
        description.length;

    // ------------------------------------------------------------
    // Images
    // ------------------------------------------------------------

    const images =
        [
            ...new Set(
                [...root.querySelectorAll(
                    '[data-carousel-pane] img[data-src-zoom-image]'
                )]
                .map(img =>
                    img.getAttribute("data-src-zoom-image")
                )
                .filter(Boolean)
            )
        ];

    const image_count =
        images.length;

    // ------------------------------------------------------------
    // Video
    // ------------------------------------------------------------

    const video =
        attr("[data-video-pane] video source", "src") ||
        attr("video source", "src");

    const has_video =
        video !== "";

    // ------------------------------------------------------------
    // Breadcrumbs
    // ------------------------------------------------------------

    let breadcrumbs = [];

    const nav =
        root.querySelector(
            '[aria-label*="breadcrumb" i], .wt-breadcrumbs'
        );

    if (nav) {
        breadcrumbs =
            [...nav.querySelectorAll("a")]
                .map(a => a.textContent.trim())
                .filter(Boolean);
    }

    // ------------------------------------------------------------
    // Tags
    // ------------------------------------------------------------

    const tags =
        [
            ...new Set(
                [...root.querySelectorAll(
                    'a[href*="/search"]'
                )]
                .map(a => a.textContent.trim())
                .filter(t =>
                    t &&
                    t.length > 2 &&
                    t.length < 60 &&
                    !/^\d+$/.test(t)
                )
            )
        ];

    // ------------------------------------------------------------
    // Listing Type
    // ------------------------------------------------------------

    const pageText =
        root.innerText;

    const digital =
        /Digital download|Instant download/i.test(pageText);

    const physical =
        !digital;

    const personalization =
        /Personalization/i.test(pageText);

    // ------------------------------------------------------------
    // Clean URL
    // ------------------------------------------------------------

    const clean_url =
        `https://www.etsy.com/listing/${id}`;

    // ------------------------------------------------------------
    // Output
    // ------------------------------------------------------------

    const data = {
        id,
        slug,

        title,

        price,
        currency,
        price_raw,

        shop,
        shop_url,

        rating,
        max_rating,
        reviews,

        favorites,

        digital,
        physical,
        personalization,

        description,
        description_length,

        breadcrumbs,
        tags,

        image_count,
        images,

        has_video,
        video,

        url: clean_url,

        scraped_at: new Date().toISOString()
    };

    console.table(data);

    const json = JSON.stringify(data, null, 4);
    copy(json);

    const filename = (title || "etsy-listing")
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/[. ]+$/, "")
        .slice(0, 150);

    const blob = new Blob([json], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    console.log(`✅ Rich listing copied to clipboard and saved as "${filename}.json".`);
})();