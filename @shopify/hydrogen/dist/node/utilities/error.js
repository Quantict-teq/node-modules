"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMarkup = void 0;
function getErrorMarkup(error) {
    return `<script type="module">
    import {ErrorOverlay} from '/@vite/client';
    document.body.appendChild(new ErrorOverlay(${JSON.stringify(error, Object.getOwnPropertyNames(error)).replace(/</g, '\\u003c')}));
</script>`;
}
exports.getErrorMarkup = getErrorMarkup;
