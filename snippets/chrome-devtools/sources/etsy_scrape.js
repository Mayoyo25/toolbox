(() => {

    const keyword =
        new URL(location.href).searchParams.get("q") || "";

    const page =
        Number(new URL(location.href).searchParams.get("page") || 1);

    const scrapedAt =
        new Date().toISOString();

    const seen = new Set();

    const listings = [];

    document
        .querySelectorAll("[data-listing-card-v2]")
        .forEach((card, index) => {

            const imageLink =
                card.querySelector("a.v2-listing-card__img");

            if (!imageLink)
                return;

            const id =
                imageLink.dataset.listingId ||
                card.dataset.listingId ||
                "";

            if (!id || seen.has(id))
                return;

            seen.add(id);

            const title =
                card.querySelector("h3")
                    ?.textContent
                    .trim() || "";

            const price =
                card.querySelector(".currency-value")
                    ?.textContent
                    .trim() || "";

            const currency =
                card.querySelector(".currency-symbol")
                    ?.textContent
                    .trim() || "";

            const shop =
                card.querySelector("[data-seller-name-link]")
                    ?.textContent
                    .trim() || "";

            const image =
                imageLink.querySelector("img")
                    ?.src || "";

            const url =
                imageLink.href.split("?")[0];

            const rating =
                parseFloat(
                    card.querySelector(".larger_review_stars .wt-text-title-smallest")
                        ?.textContent || ""
                ) || null;

            const reviews =
                Number(
                    card.querySelector(".larger_review_stars p")
                        ?.textContent
                        .replace(/[()]/g, "")
                        .replace(/,/g, "")
                ) || 0;

            const isAd =
                card.innerText.includes("Ad");

            const isDigital =
                card.innerText
                    .toLowerCase()
                    .includes("digital download");

            const isStarSeller =
                !!card.querySelector("[data-star-seller-badge]");

            const video =
                card.querySelector("video source")
                    ?.src || "";

            const imageLarge =
                imageLink.querySelector("img")
                    ?.dataset.preloadLpSrc || "";

            const shopUrl =
                card.querySelector("[data-shop-url]")
                    ?.dataset.shopUrl || "";

            listings.push({

                id,

                keyword,

                page,

                position: index + 1,

                title,

                shop,

                shopUrl,

                price,

                currency,

                rating,

                reviews,

                isAd,

                isStarSeller,

                isDigital,

                image,

                imageLarge,

                video,

                url,

                scrapedAt

            });

        });

    console.clear();

    console.table(listings);

    copy(JSON.stringify(listings, null, 4));

    console.log("");

    console.log("Listings :", listings.length);
    console.log("Keyword  :", keyword);
    console.log("Page     :", page);
    console.log("Copied to clipboard.");

})();