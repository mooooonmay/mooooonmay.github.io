function loadSettings() {
  let theme = localStorage.getItem("theme");
  if (theme) {
    document.documentElement.setAttribute("theme", theme);
  }

  let showBanner = localStorage.getItem("showBanner");
  if (showBanner == null || showBanner == undefined || showBanner == "true") {
    document.documentElement.setAttribute("showBanner", true);
  } else {
    document.documentElement.setAttribute("showBanner", false);
  }
}
loadSettings();

window.onload = function () {
  window.SHOWIMG = []; // [0] img   [1] showImg

  const { showBgMask, closeBgMask, addElemnt, cleanElement } = initBgMask();

  const allImg = document.querySelectorAll("article img");
  allImg.forEach((item) => {
    item.style.cursor = "zoom-in";
    item.addEventListener("click", () => {
      clickImgFn(item);
    });
  });

  window.addEventListener("scroll", closeImgFn);

  function initBgMask() {
    const bgBlackDiv = document.createElement("div");
    bgBlackDiv.classList.add("bg-black-img");
    setStyle(bgBlackDiv, {
      display: "block",
      position: "fixed",
      top: "0",
      height: "100vh",
      width: "100vw",
      zIndex: "0",
      background: "#000000a3",
      pointerEvents: "none",
      opacity: 0,
      transition: "opacity 0.2s cubic-bezier(0.22, 0.75, 0.71, 1.17)",
    });

    const ImgsBox = document.createElement("div");
    ImgsBox.classList.add("imgs-show-box");
    document.body.appendChild(bgBlackDiv);
    document.body.appendChild(ImgsBox);

    bgBlackDiv.addEventListener("click", closeImgFn);

    return {
      showBgMask: function () {
        setStyle(bgBlackDiv, {
          pointerEvents: "all",
          opacity: 1,
        });
      },
      closeBgMask: function () {
        if (bgBlackDiv.style.pointerEvents === "all") {
          setStyle(bgBlackDiv, {
            pointerEvents: "none",
            opacity: 0,
          });
          return true;
        }
      },
      addElemnt: function (ImgElement) {
        ImgsBox.appendChild(ImgElement);
      },
      cleanElement: function () {
        ImgsBox.innerHTML = "";
      },
    };
  }

  function clickImgFn(ImgElement) {
    if (SHOWIMG.length > 0) return;

    const newImg = new Image();

    SHOWIMG = [ImgElement, newImg];

    setStyle(ImgElement, {
      transition: "opacity 1s cubic-bezier(0.22, 0.75, 0.71, 1.17)",
    });

    const info = ImgElement.getBoundingClientRect();
    // item.style.opacity = "0";

    newImg.src = ImgElement.src;
    setStyle(newImg, {
      transition: "transform 0.3s cubic-bezier(0.22, 0.75, 0.71, 1.17)",
      transformOrgin: "center",
      width: info.width + "px",
      height: info.height + "px",
      position: "absolute",
      top: `${window.scrollY + info.y}px`,
      left: `${info.left}px`,
      borderRadius: "8px",
      opacity: "0",
    });

    addElemnt(newImg);

    newImg.addEventListener("click", closeImgFn);

    newImg.addEventListener("load", () => {
      requestAnimationFrame(() => {
        setStyle(newImg, {
          opacity: "1",
        });

        requestAnimationFrame(() => {
          ImgElement.style.visibility = "hidden";

          //   比例 实时根据是否手机显示
          const p = window.innerWidth < 768 ? 0.98 : 0.8;
          newImg.offsetHeight;

          newImg.style.transform = `translate(${
            (window.innerWidth - info.width) / 2 - info.left
          }px, ${
            (window.innerHeight - info.height) / 2 - info.top
          }px) scale(${Math.min(
            (window.innerWidth * p) / info.width,
            (window.innerHeight * p) / info.height
          )})`;

          showBgMask();
        });
      });
    });
  }

  function closeImgFn() {
    if (closeBgMask() && SHOWIMG.length == 0) {
      // 异常处理
      cleanElement();
      allImg.forEach((item) =>
        setStyle(item, {
          visibility: "visible",
        })
      );
      console.log("异常处理");
    }

    if (SHOWIMG.length == 0) return;
    const SHOWIMG_ = [...SHOWIMG];
    SHOWIMG.length = 0;

    const AnimateObj = SHOWIMG_[1].animate(
      {
        transform: `translate(0, 0)`,
      },
      {
        duration: 300,
        easing: "cubic-bezier(0.22, 0.75, 0.71, 1.17)",
        fill: "forwards",
      }
    );

    AnimateObj.onfinish = () => {
      console.log(SHOWIMG);
      SHOWIMG_[1].remove();
      console.log("finish", SHOWIMG_[1]);
      SHOWIMG_[0].style.visibility = "visible";
      SHOWIMG_[0].style.transition = "";
      SHOWIMG_[0].style.opacity = "1";
    };
  }

  window.closeImgFn = closeImgFn;

  function setStyle(el, styles) {
    for (const key in styles) {
      if (Object.hasOwnProperty.call(styles, key)) {
        el.style[key] = styles[key];
      }
    }
  }
};
