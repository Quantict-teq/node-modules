import { useServerRequest } from '../ServerRequestProvider';
/** The `useSession` hook reads session data in server components. */
export const useSession = function () {
    var _a;
    const request = useServerRequest();
    const session = (_a = request.ctx.session) === null || _a === void 0 ? void 0 : _a.get();
    return session;
};
