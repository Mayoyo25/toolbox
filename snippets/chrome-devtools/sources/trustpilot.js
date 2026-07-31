(() => {

    const pageUrl =
        location.href;

    const filename =
        pageUrl
            .replace(/^https?:\/\//i, "")
            .replace(/[<>:"/\\|?*#&=%+\x00-\x1F]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "")
            .toLowerCase()
            .slice(0, 180);

    const seen =
        new Set();

    const reviews =
        [];

    document
        .querySelectorAll(
            '[data-reviews-list-start] > div:has(article[data-service-review-card-paper])'
        )
        .forEach((card, index) => {

            const article =
                card.querySelector("article[data-service-review-card-paper]");

            if (!article)
                return;

            const url =
                article.querySelector('a[href*="/reviews/"]')
                    ?.href || "";

            const id =
                url.split("/reviews/")[1] || "";

            if (!id || seen.has(id))
                return;

            seen.add(id);

            const author =
                article.querySelector("[data-consumer-name-typography='true']")
                    ?.textContent
                    .trim() || "";

            const country =
                article.querySelector("[data-consumer-country-typography='true']")
                    ?.textContent
                    .trim() || "";

            const date =
                article.querySelector("time")
                    ?.getAttribute("datetime") || "";

            const title =
                article.querySelector("[data-service-review-title-typography='true']")
                    ?.textContent
                    .trim() || "";

            const review =
                article.querySelector("[data-service-review-text-typography='true']")
                    ?.textContent
                    .trim() || "";

            const stars =
                Number(
                    article
                        .querySelector("[data-service-review-rating]")
                        ?.getAttribute("data-service-review-rating")
                ) || null;

            reviews.push({

                id,

                position: index + 1,

                author,

                country,

                stars,

                title,

                review,

                date,

                url

            });

        });

    const output = {

        pageUrl,

        reviews

    };

    console.clear();

    console.table(reviews);

    const json =
        JSON.stringify(output, null, 4);

    copy(json);

    const blob =
        new Blob([json], {
            type: "application/json"
        });

    const objectUrl =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href =
        objectUrl;

    a.download =
        `${filename}.json`;

    document.body.appendChild(a);

    a.click();

    a.remove();

    setTimeout(
        () => URL.revokeObjectURL(objectUrl),
        1000
    );

    console.log("");

    console.log("Reviews :", reviews.length);
    console.log("Page    :", pageUrl);
    console.log(`Saved   : ${filename}.json`);
    console.log("Copied to clipboard.");

})();