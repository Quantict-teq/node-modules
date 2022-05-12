"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useNavigate_1 = require("../../foundation/useNavigate/useNavigate");
function Redirect({ to }) {
    const navigate = (0, useNavigate_1.useNavigate)();
    (0, react_1.useEffect)(() => {
        if (to.startsWith('http')) {
            window.location.href = to;
        }
        else {
            navigate(to);
        }
    }, []);
    return null;
}
exports.default = Redirect;
