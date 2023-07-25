let fileInput = document.getElementById("file-input");
let FilterOptions = document.querySelectorAll(".filter button");
let RotateOptions = document.querySelectorAll(".rotate button");
let slider = document.querySelector(".slider input");
let filterName = document.getElementById("name");
let filterValue = document.getElementById("value");
let image = document.getElementById("image");
let upload = document.getElementById("choose-img");
let download = document.getElementById("save-img");
let resetBtn = document.getElementById("reset");
let imageBox = document.querySelector(".preview-image");

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0, rotation = 0, flipVer = 1, flipHor = 1;

function loadImage() {
    let file = fileInput.files[0];
    if (!file) { return; }
    image.src = URL.createObjectURL(file);
    image.addEventListener("load", () => {
        document.querySelector(".container").classList.remove("disable");
    })
}

function saveImage() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotation !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHor, flipVer);
    ctx.drawImage(image, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    let link = document.createElement("a");
    link.download = "updated_image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}

function applyFilter() {
    image.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

function applyRotation() {
    image.style.transform = `rotate(${rotation}deg) scaleX(${flipVer}) scaleY(${flipHor})`;
}

function resetFilter() {
    brightness = 100
    saturation = 100
    inversion = 0
    grayscale = 0;
    rotation = 0;
    flipHor = 1;
    flipVer = 1;
    FilterOptions.forEach((filter) => {
        if (filter.id === "Brightness") {
            slider.value = brightness;
        }
        else if (filter.id === "Saturation") {
            slider.value = saturation;
        }
        else if (filter.id === "Inversion") {
            slider.value = inversion;
        }
        else {
            slider.value = grayscale;
        }
        filterValue.innerText = `${slider.value}%`;
    })
    applyFilter();
    applyRotation();
}

function updateFilter() {
    filterValue.innerText = `${slider.value}%`;
    let selectedFilter = document.querySelector(".filter .active");
    if (selectedFilter.id === "Brightness") {
        brightness = slider.value;
    }
    else if (selectedFilter.id === "Saturation") {
        saturation = slider.value;
    }
    else if (selectedFilter.id === "Inversion") {
        inversion = slider.value;
    }
    else {
        grayscale = slider.value;
    }
    applyFilter();
}

function dropImage(e) {
    e.preventDefault();
    fileInput.files = e.dataTransfer.files;
    loadImage();
}

FilterOptions.forEach((filter) => {
    filter.addEventListener("click", () => {
        document.querySelector(".filter .active").classList.remove("active");
        filter.classList.add("active");
        filterName.innerText = filter.innerText;
        if (filter.id === "Brightness") {
            slider.max = "200";
            slider.value = brightness;
        }
        else if (filter.id === "Saturation") {
            slider.max = "200";
            slider.value = saturation;
        }
        else if (filter.id === "Inversion") {
            slider.max = "100";
            slider.value = inversion;
        }
        else {
            slider.max = "100";
            slider.value = grayscale;
        }
        filterValue.innerText = `${slider.value}%`;
    })
})

RotateOptions.forEach((option) => {
    option.addEventListener("click", () => {
        if (option.id === "right") {
            rotation += 90;
        }
        else if (option.id === "left") {
            rotation -= 90;
        }
        else if (option.id === "vertical") {
            flipVer = -flipVer;
        }
        else {
            flipHor = -flipHor;
        }
        applyRotation();
    })
})

slider.addEventListener("input", updateFilter);
fileInput.addEventListener("change", loadImage);
upload.addEventListener("click", () => fileInput.click());
resetBtn.addEventListener("click", resetFilter);
download.addEventListener("click", saveImage);
imageBox.addEventListener("dragover", (e) => e.preventDefault());
imageBox.addEventListener("drop", dropImage);