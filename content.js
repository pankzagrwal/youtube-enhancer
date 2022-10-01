(async function () {
  let urlObserver;
  let contentObserver;

  function waitForElm(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve();
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          resolve();
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  async function startMagic() {
    observeURLChange();
    removeContent();
    if (location.href.indexOf("/watch") > 0) {
      await waitForElm("#content");
      observeContent();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startMagic);
  } else {
    startMagic();
  }

  document.addEventListener("beforeunload", function () {
    urlObserver?.disconnect();
    contentObserver?.disconnect();
  });

  function removeContent() {
    const mastheadAd = document.querySelectorAll("#masthead-ad");
    const shortsContainer = document.querySelector("[is-shorts]")?.parentNode;
    const chatContainer = document.getElementById("chat");
    const recomendedContent = document.getElementsByTagName(
      "ytd-watch-next-secondary-results-renderer"
    )[0];
    const adsContainer = document.getElementById("player-ads");

    const commentContainer = document.getElementById("comments");

    const relatedSkeleton = document.getElementById("related-skeleton");

    if (mastheadAd) {
      for (const ad of mastheadAd) {
        ad.style.display = "none";
      }
    }

    if (shortsContainer) {
      shortsContainer.style.display = "none";
    }

    if (chatContainer) {
      chatContainer.style.display = "none";
    }

    if (recomendedContent) {
      recomendedContent.style.display = "none";
    }

    if (adsContainer) {
      adsContainer.style.display = "none";
    }

    if (commentContainer) {
      commentContainer.style.display = "none";
    }

    if (relatedSkeleton) {
      relatedSkeleton.style.display = "none";
    }
  }

  function observeURLChange() {
    let lastUrl = location.href;
    urlObserver = new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        onUrlChange();
      }
    });
    urlObserver.observe(document, { subtree: true, childList: true });

    function onUrlChange() {
      removeContent();
      contentObserver?.disconnect();
      if (location.href.indexOf("/watch") > 0) {
        observeContent();
      }
    }
  }

  function observeContent() {
    const config = { childList: true, subtree: true };
    const callback = function () {
      document.getElementById("comments").style.display = "none";
      document.getElementById("related").style.display = "none";
      for (const button of document.getElementsByClassName(
        "ytp-ad-skip-button"
      )) {
        button.click();
      }
    };

    contentObserver = new MutationObserver(callback);
    contentObserver.observe(document.getElementById("content"), config);
  }
})();
