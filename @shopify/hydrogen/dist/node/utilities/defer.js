"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defer = void 0;
function defer() {
    const deferred = { status: 'pending' };
    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = (value) => {
            deferred.status = 'resolved';
            return resolve(value);
        };
        deferred.reject = (error) => {
            deferred.status = 'rejected';
            return reject(error);
        };
    });
    return deferred;
}
exports.defer = defer;
