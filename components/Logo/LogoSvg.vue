<template>
    <div>
        <svg height="100%" viewBox="0 0 80 70" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="logo" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <rect id="rect-bg" fill="#448aff" x="16" y="16" width="51" height="38" rx="3"></rect>
                <rect id="rect-border" stroke="#4A4A4A" stroke-width="3" x="9.5" y="9.5" width="63" height="50" rx="4"></rect>
                <polyline class="corner" stroke="#4A4A4A" stroke-width="3" points="13.0822663 3 2 3 2 14.8336418"></polyline>
                <polyline class="corner" stroke="#4A4A4A" stroke-width="3" transform="translate(73.541133, 7.916821) scale(-1, 1) translate(-73.541133, -7.916821) " points="79.0822663 2 68 2 68 13.8336418"></polyline>
                <polyline class="corner" stroke="#4A4A4A" stroke-width="3" transform="translate(73.541133, 60.916821) scale(-1, -1) translate(-73.541133, -60.916821) " points="79.0822663 55 68 55 68 66.8336418"></polyline>
                <polyline class="corner" stroke="#4A4A4A" stroke-width="3" transform="translate(8.015200, 60.916821) scale(1, -1) translate(-8.015200, -60.916821) " points="13.5563335 55 2.47406724 55 2.47406724 66.8336418"></polyline>
                <path class="inner" d="M48,47 L62.8380177,47" id="Path-4" stroke="#FFFFFF" stroke-width="3"></path>
                <path class="inner"  stroke="#979797"></path>
                <polyline class="inner"  stroke="#FFFFFF" stroke-width="3" points="21 22 42 35.6444727 22.9837962 48"></polyline>
            </g>
        </svg>
    </div>
</template>

<script>
export default {

}
</script>

<style lang='stylus' scoped>
$width = 64;
$height = 50;

@keyframes move {
    0% {
        stroke-dasharray: 0, ((($width + $height)));
        stroke-dashoffset: ($width + $height) * 2;
    }

    100% {
        stroke-dasharray: $width, 0;
        stroke-dashoffset: 0;
    }
}

@keyframes fade-move {
    0% {
        opacity: 0;
        stroke-dasharray: 0, $width + $height;
        stroke-dashoffset: ($width + $height) * 2;
    }

    50% {
        opacity: 0;
    }

    100% {
        opacity: 100%;
        stroke-dasharray: $width, 0;
        stroke-dashoffset: 0;
    }
}

@keyframes fade {
    0% {
        opacity: 0;
    }

    50% {
        opacity: 0;
    }

    100% {
        opacity: 100%;
    }
}

#rect-border {
    animation: move 1s ease infinite alternate;
}

.corner {
    animation: move 1s ease infinite alternate;
}

#rect-bg {
    animation: fade 1.5s ease;
}

.inner {
    animation: fade-move 1.5s ease;
}
</style>